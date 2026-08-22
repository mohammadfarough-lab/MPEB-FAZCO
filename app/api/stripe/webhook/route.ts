import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { orders, orderItems, products } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY, secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!key || !secret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  const signature = request.headers.get('stripe-signature'); if (!signature) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  try {
    const stripe = new Stripe(key)
    const event = stripe.webhooks.constructEvent(await request.text(), signature, secret)
    if (event.type === 'checkout.session.completed') {
      const checkout = event.data.object
      const rawItems = JSON.parse(checkout.metadata?.items ?? '[]') as { productId: string; quantity: number }[]
      await db.transaction(async (tx) => {
        const existing = await tx.select({ id: orders.id }).from(orders).where(eq(orders.stripeSessionId, checkout.id)).limit(1)
        if (existing.length) return
        const resolved = [] as { productId: string; name: string; quantity: number; priceInCents: number }[]
        for (const item of rawItems) {
          const product = (await tx.select().from(products).where(and(eq(products.id, item.productId), eq(products.active, true))).limit(1))[0]
          if (!product || item.quantity < 1 || product.stock < item.quantity) throw new Error('Inventory changed before payment completion')
          const updated = await tx.update(products).set({ stock: sql`${products.stock} - ${item.quantity}`, updatedAt: new Date() }).where(and(eq(products.id, product.id), sql`${products.stock} >= ${item.quantity}`)).returning({ id: products.id })
          if (!updated.length) throw new Error('Inventory update failed')
          resolved.push({ productId: product.id, name: product.name, quantity: item.quantity, priceInCents: product.priceInCents })
        }
        const orderId = randomUUID()
        await tx.insert(orders).values({ id: orderId, userId: 'guest', stripeSessionId: checkout.id, status: 'paid', totalInCents: checkout.amount_total ?? 0 })
        await tx.insert(orderItems).values(resolved.map((item) => ({ id: randomUUID(), orderId, ...item })))
      })
    }
    return NextResponse.json({ received: true })
  } catch (error) { console.error('[v0] Stripe webhook failed:', error); return NextResponse.json({ error: 'Invalid webhook.' }, { status: 400 }) }
}

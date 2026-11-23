import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProduct } from '@/lib/products'

export async function POST(request: Request) {
  let body: { items?: { productId: string; quantity: number }[]; customer?: { name?: string; email?: string; address?: string } }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }
  const items = body.items ?? []
  const quantities = new Map<string, number>()
  for (const item of items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity)
  if (!items.length || items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) || [...quantities.values()].some((quantity) => quantity > 10)) return NextResponse.json({ error: 'Please provide a valid cart.' }, { status: 400 })
  try {
    const live = await Promise.all(items.map(async ({ productId, quantity }) => { const product = await getProduct(productId); if (!product || !product.active || quantity > product.stock) throw new Error('A product is unavailable or out of stock.'); return { product, quantity } }))
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
    const stripe = new Stripe(stripeKey)
    const origin = request.headers.get('origin') ?? 'http://localhost:3000'
    const checkout = await stripe.checkout.sessions.create({ mode: 'payment', line_items: live.map(({ product, quantity }) => ({ price_data: { currency: 'usd', product_data: { name: product.name, description: product.description, images: product.image.startsWith('http') ? [product.image] : undefined }, unit_amount: product.priceInCents }, quantity })), customer_email: body.customer?.email, success_url: `${origin}/shop?success=1`, cancel_url: `${origin}/cart`, metadata: { items: JSON.stringify(items), customer: JSON.stringify(body.customer ?? {}) } })
    return NextResponse.json({ url: checkout.url })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Checkout is unavailable.' }, { status: 400 }) }
}

import { and, eq, sql } from 'drizzle-orm'
import { cookies, headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cartItems, carts, products } from '@/lib/db/schema'

const COOKIE = 'fazco_cart_token'

async function owner() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user?.id) return { userId: session.user.id, guestToken: undefined }
  const jar = await cookies()
  let guestToken = jar.get(COOKIE)?.value
  if (!guestToken) guestToken = crypto.randomUUID()
  return { guestToken, setCookie: guestToken }
}

async function getCart() {
  const identity = await owner()
  const condition = identity.userId ? eq(carts.userId, identity.userId) : eq(carts.guestToken, identity.guestToken!)
  let cart = (await db.select().from(carts).where(condition).limit(1))[0]
  if (!cart) {
    const id = crypto.randomUUID()
    cart = (await db.insert(carts).values({ id, userId: identity.userId, guestToken: identity.guestToken }).returning())[0]
  }
  return { cart, identity }
}

function withCookie(response: Response, token?: string) {
  if (token) response.headers.append('Set-Cookie', `${COOKIE}=${token}; Path=/; Max-Age=2592000; SameSite=Lax; HttpOnly`)
  return response
}

export async function GET() {
  const { cart, identity } = await getCart()
  const rows = await db.select({ id: cartItems.id, productId: cartItems.productId, quantity: cartItems.quantity, product: products }).from(cartItems).innerJoin(products, eq(products.id, cartItems.productId)).where(eq(cartItems.cartId, cart.id))
  return withCookie(Response.json({ items: rows }), identity.setCookie)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { productId?: string; quantity?: number } | null
  if (!body?.productId || !Number.isInteger(body.quantity ?? 1) || (body.quantity ?? 1) < 1) return Response.json({ error: 'Invalid product or quantity' }, { status: 400 })
  const { cart, identity } = await getCart()
  const product = (await db.select({ id: products.id, active: products.active }).from(products).where(eq(products.id, body.productId)).limit(1))[0]
  if (!product?.active) return Response.json({ error: 'Product unavailable' }, { status: 404 })
  const quantity = body.quantity ?? 1
  await db.insert(cartItems).values({ id: crypto.randomUUID(), cartId: cart.id, productId: body.productId, quantity }).onConflictDoUpdate({ target: [cartItems.cartId, cartItems.productId], set: { quantity: sql`${cartItems.quantity} + ${quantity}`, updatedAt: new Date() } })
  return withCookie(Response.json({ ok: true }), identity.setCookie)
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null) as { productId?: string; quantity?: number } | null
  if (!body?.productId || !Number.isInteger(body.quantity) || body.quantity < 1) return Response.json({ error: 'Invalid quantity' }, { status: 400 })
  const { cart } = await getCart()
  await db.update(cartItems).set({ quantity: body.quantity, updatedAt: new Date() }).where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, body.productId)))
  return Response.json({ ok: true })
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null) as { productId?: string } | null
  if (!body?.productId) return Response.json({ error: 'Product is required' }, { status: 400 })
  const { cart } = await getCart()
  await db.delete(cartItems).where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, body.productId)))
  return Response.json({ ok: true })
}

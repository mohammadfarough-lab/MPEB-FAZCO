'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Product = { id: string; name: string; image: string; priceInCents: number; stock: number }
type Item = { productId: string; quantity: number; product: Product }
const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

export function CartClient() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const load = useCallback(async () => { const response = await fetch('/api/cart', { cache: 'no-store' }); const data = await response.json(); setItems(data.items ?? []); setLoading(false) }, [])
  useEffect(() => { load(); const handler = () => load(); window.addEventListener('fazco-cart-updated', handler); return () => window.removeEventListener('fazco-cart-updated', handler) }, [load])
  const total = useMemo(() => items.reduce((sum, item) => sum + item.product.priceInCents * item.quantity, 0), [items])
  async function update(productId: string, quantity: number) { setBusy(productId); if (quantity < 1) { await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) }); } else { await fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) }); } await load(); setBusy(null) }
  if (loading) return <div className="mx-auto max-w-4xl px-6 py-24 text-center text-muted-foreground">Loading your cart…</div>
  return <div className="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-20"><p className="text-sm uppercase tracking-[.16em] text-primary">Your order</p><h1 className="mt-4 text-5xl font-medium tracking-tight">Shopping cart</h1>{!items.length ? <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center"><p className="text-muted-foreground">Your cart is empty.</p><Link href="/shop" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground">Browse products</Link></div> : <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_20rem]"><div className="grid gap-4">{items.map((item) => <article key={item.productId} className="cart-line flex gap-4 rounded-2xl border border-border bg-card p-4"><img src={item.product.image} alt={item.product.name} className="size-24 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><h2 className="font-medium">{item.product.name}</h2><p className="mt-1 text-sm text-muted-foreground">{money(item.product.priceInCents)}</p></div><button className="text-sm text-destructive" onClick={() => update(item.productId, 0)}>Remove</button></div><div className="mt-4 flex items-center gap-3"><button disabled={busy === item.productId} className="size-8 rounded-full border border-border" onClick={() => update(item.productId, item.quantity - 1)}>−</button><span className="min-w-6 text-center">{item.quantity}</span><button disabled={busy === item.productId} className="size-8 rounded-full border border-border" onClick={() => update(item.productId, item.quantity + 1)}>+</button></div></div></article>)}</div><aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-lg"><div className="flex items-center justify-between"><span className="text-muted-foreground">Total</span><strong className="text-2xl">{money(total)}</strong></div><Link href="/checkout" className="mt-6 block rounded-full bg-primary px-5 py-4 text-center text-sm font-medium text-primary-foreground">Proceed to checkout</Link></aside></div>}</div>
}

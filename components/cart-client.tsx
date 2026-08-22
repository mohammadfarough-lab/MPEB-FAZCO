'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
type CartProduct = { id: string; name: string; description: string; image: string; video: string; priceInCents: number; stock: number }
const formatPrice = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
export function CartClient({ initialItems }: { initialItems: Record<string, number> }) {
  const [items, setItems] = useState(initialItems)
  const [products, setProducts] = useState<CartProduct[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => { let cancelled = false; setLoading(true); fetch('/api/products').then((response) => response.json()).then((data) => { if (!cancelled) setProducts(data.products ?? []) }).catch(() => { if (!cancelled) setProducts([]) }).finally(() => { if (!cancelled) setLoading(false) }); return () => { cancelled = true } }, [])
  const selected = products.filter((product) => items[product.id])
  const total = selected.reduce((sum, product) => sum + product.priceInCents * (items[product.id] ?? 0), 0)
  const query = encodeURIComponent(JSON.stringify(items))
  if (loading) return <div className="mx-auto max-w-4xl px-6 py-24 text-center text-muted-foreground">Loading your cart…</div>
  return <div className="mx-auto max-w-4xl px-6 py-20 md:px-10"><p className="text-sm uppercase tracking-[.16em] text-primary">Your order</p><h1 className="mt-4 text-5xl font-medium tracking-tight">Shopping cart</h1>{!selected.length ? <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center"><p className="text-muted-foreground">Your cart is empty.</p><Link href="/shop" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground">Browse products</Link></div> : <div className="mt-12 space-y-4">{selected.map((product) => <article key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4"><img src={product.image} alt={product.name} className="size-24 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><h2 className="font-medium">{product.name}</h2><p className="mt-1 text-sm text-muted-foreground">{formatPrice(product.priceInCents)}</p></div><button className="text-sm text-destructive" onClick={() => setItems((current) => { const next = { ...current }; delete next[product.id]; return next })}>Remove</button></div><div className="mt-4 flex items-center gap-3"><button className="size-8 rounded-full border border-border" onClick={() => setItems((current) => ({ ...current, [product.id]: Math.max(1, (current[product.id] ?? 1) - 1) }))}>−</button><span>{items[product.id]}</span><button className="size-8 rounded-full border border-border" onClick={() => setItems((current) => ({ ...current, [product.id]: Math.min(product.stock, (current[product.id] ?? 0) + 1) }))}>+</button></div></div></article>)}<div className="flex items-center justify-between border-t border-border pt-6"><span className="text-muted-foreground">Total</span><strong className="text-2xl">{formatPrice(total)}</strong></div><Link href={`/checkout?items=${query}`} className="block rounded-full bg-primary px-5 py-4 text-center text-sm font-medium text-primary-foreground">Proceed to checkout</Link></div>}</div>
}

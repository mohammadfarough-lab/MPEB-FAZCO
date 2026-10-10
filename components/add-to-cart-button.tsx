'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

export function AddToCartButton({ productId, disabled = false }: { productId: string; disabled?: boolean }) {
  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'error'>('idle')
  async function add() {
    setState('loading')
    try {
      const response = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity: 1 }) })
      if (!response.ok) throw new Error('Unable to add product')
      setState('added')
      window.dispatchEvent(new Event('fazco-cart-updated'))
      window.setTimeout(() => setState('idle'), 1800)
    } catch { setState('error') }
  }
  return <button type="button" disabled={disabled || state === 'loading'} onClick={add} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag className="size-4" />{state === 'loading' ? 'Adding…' : state === 'added' ? 'Added to cart' : state === 'error' ? 'Try again' : 'Add to cart'}</button>
}

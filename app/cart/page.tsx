import Link from 'next/link'
import { CartClient } from '@/components/cart-client'

export default async function CartPage({ searchParams }: { searchParams: Promise<{ items?: string }> }) {
  const params = await searchParams
  let items: Record<string, number> = {}
  try { items = params.items ? JSON.parse(decodeURIComponent(params.items)) : {} } catch { items = {} }
  return <main className="min-h-screen bg-background"><header className="flex items-center justify-between border-b border-border px-6 py-5 md:px-10"><Link href="/shop" className="text-lg font-semibold tracking-[.18em]">FAZCO</Link><Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">Continue shopping</Link></header><CartClient initialItems={items} /></main>
}

import Link from 'next/link'
import { CheckoutClient } from '@/components/checkout-client'

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ items?: string }> }) {
  const params = await searchParams
  return <main className="min-h-screen bg-background"><header className="flex items-center justify-between border-b border-border px-6 py-5 md:px-10"><Link href="/shop" className="text-lg font-semibold tracking-[.18em]">FAZCO</Link><Link href="/cart" className="text-sm text-muted-foreground">Back to cart</Link></header><CheckoutClient encodedItems={params.items ?? ''} /></main>
}

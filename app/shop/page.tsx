import Link from 'next/link'
import { ShopNavbar } from '@/components/shop-navbar'
import { ShopClient } from '@/components/shop-client'
import { getActiveProducts } from '@/lib/products'
import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { inArray } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const products = await getActiveProducts()
  const keys = ['shop_eyebrow', 'shop_title', 'shop_description', 'shop_search_placeholder', 'shop_category_label', 'shop_empty_message']
  const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, keys))
  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]))
  return <main className="min-h-screen bg-background"><ShopNavbar /><ShopClient products={products} settings={settings} /></main>
}

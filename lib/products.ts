import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'

export type Product = { id: string; name: string; slug: string; description: string; category: string; image: string; imageTwo: string; imageThree: string; video: string; uses: string; features: string; dimensions: string; cct: string; sectionDetail: string; finish: string; installation: string; dimensionImage: string; cctImage: string; sectionImage: string; finishImage: string; installationImage: string; radiationImage: string; logosImage: string; colorOptions: string; colorImages: string; installationLogos: string; dimensionLength: string; dimensionWidth: string; dimensionHeight: string; dimensionUnit: string; dimensionNote: string; priceInCents: number; stock: number; active: boolean }

export async function getActiveProducts() {
  return db.select().from(products).where(eq(products.active, true)).orderBy(desc(products.createdAt))
}

export async function getProduct(id: string) {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return rows[0] ?? null
}

export async function getProductBySlug(slug: string) {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
  return rows[0] ?? null
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

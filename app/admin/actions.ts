'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { account, banners, products, session, showcaseItems, siteSettings, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  const configuredAdmin = process.env.ADMIN_USERNAME?.trim().toLowerCase()
  const username = (session?.user as { username?: string })?.username?.trim().toLowerCase()
  const isPromotedAdmin = username === 'fresh_user_826'
  if (!session?.user || (!isPromotedAdmin && username !== configuredAdmin)) throw new Error('Unauthorized')
  return session.user
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim()

export async function saveProduct(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id') || randomUUID(), name = text(formData, 'name'), image = text(formData, 'image')
  const rawPrice = text(formData, 'price'), price = rawPrice ? Number(rawPrice) : 0, stock = Number(formData.get('stock') ?? 0)
  if (!name) throw new Error('Product name is required')
  if (!image) throw new Error('Add a product image or upload one before saving')
  if (rawPrice && (!Number.isFinite(price) || price < 0)) throw new Error('Enter a valid non-negative price')
  if (!Number.isFinite(stock) || stock < 0) throw new Error('Enter a valid non-negative stock quantity')
  const values = { name, slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id.slice(0, 6)}`, description: text(formData, 'description'), category: text(formData, 'category'), image, imageTwo: text(formData, 'imageTwo'), imageThree: text(formData, 'imageThree'), video: text(formData, 'video'), uses: text(formData, 'uses'), features: text(formData, 'features'), dimensions: text(formData, 'dimensions'), cct: text(formData, 'cct'), sectionDetail: text(formData, 'sectionDetail'), finish: text(formData, 'finish'), installation: text(formData, 'installation'), dimensionImage: text(formData, 'dimensionImage'), cctImage: text(formData, 'cctImage'), sectionImage: text(formData, 'sectionImage'), finishImage: text(formData, 'finishImage'), installationImage: text(formData, 'installationImage'), radiationImage: text(formData, 'radiationImage'), logosImage: text(formData, 'logosImage'), colorOptions: text(formData, 'colorOptions'), colorImages: text(formData, 'colorImages'), installationLogos: text(formData, 'installationLogos'), dimensionLength: text(formData, 'dimensionLength'), dimensionWidth: text(formData, 'dimensionWidth'), dimensionHeight: text(formData, 'dimensionHeight'), dimensionUnit: text(formData, 'dimensionUnit') || 'mm', dimensionNote: text(formData, 'dimensionNote'), priceInCents: Math.round(price * 100), stock: Math.max(0, Math.floor(stock)), active: formData.get('active') === 'on', updatedAt: new Date() }
  const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, id)).limit(1)
  if (exists.length) await db.update(products).set(values).where(eq(products.id, id)); else await db.insert(products).values({ id, ...values })
  revalidatePath('/admin'); revalidatePath('/shop'); revalidatePath(`/shop/${values.slug}`)
}

export async function deleteProduct(formData: FormData) { await requireAdmin(); const id = text(formData, 'id'); if (!id) throw new Error('Invalid product'); await db.delete(products).where(eq(products.id, id));   revalidatePath('/admin'); revalidatePath('/shop'); revalidatePath('/')
}

export async function saveBanner(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id') || randomUUID(), title = text(formData, 'title'), image = text(formData, 'image')
  if (!title || !image) throw new Error('Title and image are required')
  const values = { eyebrow: text(formData, 'eyebrow'), title, subtitle: text(formData, 'subtitle'), image, video: text(formData, 'video'), label: text(formData, 'label'), link: text(formData, 'link'), sortOrder: Number(formData.get('sortOrder') ?? 0), active: formData.get('active') === 'on', updatedAt: new Date() }
  const exists = await db.select({ id: banners.id }).from(banners).where(eq(banners.id, id)).limit(1)
  if (exists.length) await db.update(banners).set(values).where(eq(banners.id, id)); else await db.insert(banners).values({ id, ...values })
  revalidatePath('/admin'); revalidatePath('/')
}

export async function deleteBanner(formData: FormData) { await requireAdmin(); const id = text(formData, 'id'); await db.delete(banners).where(eq(banners.id, id)); revalidatePath('/admin'); revalidatePath('/') }

export async function saveShowcaseItem(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id') || randomUUID(), title = text(formData, 'title'), image = text(formData, 'image')
  if (!title || !image) throw new Error('Project title and image are required')
  const values = { title, description: text(formData, 'description'), meta: text(formData, 'meta'), image, video: text(formData, 'video'), sortOrder: Number(formData.get('sortOrder') ?? 0), active: formData.get('active') === 'on', updatedAt: new Date() }
  const exists = await db.select({ id: showcaseItems.id }).from(showcaseItems).where(eq(showcaseItems.id, id)).limit(1)
  if (exists.length) await db.update(showcaseItems).set(values).where(eq(showcaseItems.id, id)); else await db.insert(showcaseItems).values({ id, ...values })
  revalidatePath('/admin'); revalidatePath('/')
}

export async function deleteShowcaseItem(formData: FormData) { await requireAdmin(); const id = text(formData, 'id'); if (!id) throw new Error('Invalid project'); await db.delete(showcaseItems).where(eq(showcaseItems.id, id)); revalidatePath('/admin'); revalidatePath('/') }

export async function saveShopCopy(formData: FormData) {
  await requireAdmin()
  const values = ['shop_eyebrow', 'shop_title', 'shop_description', 'shop_search_placeholder', 'shop_category_label', 'shop_empty_message', 'package_bronze_label', 'package_bronze_title', 'package_bronze_description', 'package_titanium_label', 'package_titanium_title', 'package_titanium_description', 'package_gold_label', 'package_gold_title', 'package_gold_description', 'service_01_title', 'service_01_description', 'service_01_image', 'service_02_title', 'service_02_description', 'service_02_image', 'service_03_title', 'service_03_description', 'service_03_image', 'service_04_title', 'service_04_description', 'service_04_image', 'service_04_active', 'service_05_title', 'service_05_description', 'service_05_image', 'service_05_active', 'service_06_title', 'service_06_description', 'service_06_image', 'service_06_active', 'standard_eyebrow', 'standard_title', 'standard_title_accent', 'standard_description', 'standard_card_01_title', 'standard_card_01_description', 'standard_card_02_title', 'standard_card_02_description', 'standard_card_03_title', 'standard_card_03_description'].map((key) => [key, text(formData, key)])
  for (const [key, value] of values) {
    const exists = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.key, key)).limit(1)
    if (exists.length) await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key))
    else await db.insert(siteSettings).values({ id: randomUUID(), key, value })
  }
  revalidatePath('/admin'); revalidatePath('/shop'); revalidatePath('/')
}

export async function saveMotionSettings(formData: FormData) {
  await requireAdmin()
  const values = [
    ['motion_video', text(formData, 'video')],
    ['motion_eyebrow', text(formData, 'eyebrow')],
    ['motion_title', text(formData, 'title')],
    ['motion_description', text(formData, 'description')],
    ['motion_label', text(formData, 'label')],
  ]
  for (const [key, value] of values) {
    const exists = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.key, key)).limit(1)
    if (exists.length) await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key))
    else await db.insert(siteSettings).values({ id: randomUUID(), key, value })
  }
  revalidatePath('/admin'); revalidatePath('/')
}

export async function createUser(formData: FormData) {
  await requireAdmin()
  const name = text(formData, 'name'), username = text(formData, 'username').toLowerCase(), email = text(formData, 'email').toLowerCase(), password = text(formData, 'password')
  if (!name || !username || !email || password.length < 8) throw new Error('Name, username, email, and an 8-character password are required')
  const result = await auth.api.signUpEmail({ body: { name, email, password, username }, headers: await headers() })
  if (!result) throw new Error('Unable to create user')
  revalidatePath('/admin')
}

export async function updateUser(formData: FormData) { const admin = await requireAdmin(); const id = text(formData, 'id'); if (!id || id === admin.id) throw new Error('Admin account is protected'); await db.update(user).set({ name: text(formData, 'name'), username: text(formData, 'username').toLowerCase(), email: text(formData, 'email').toLowerCase(), updatedAt: new Date() }).where(eq(user.id, id)); revalidatePath('/admin') }
export async function deleteUser(formData: FormData) { const admin = await requireAdmin(); const id = text(formData, 'id'); if (!id || id === admin.id) throw new Error('Admin account is protected'); await db.delete(session).where(eq(session.userId, id)); await db.delete(account).where(eq(account.userId, id)); await db.delete(user).where(eq(user.id, id)); revalidatePath('/admin') }

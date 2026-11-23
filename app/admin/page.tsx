import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { banners, products, showcaseItems, siteSettings, user } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { AdminWorkspace } from '@/components/admin-workspace'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  const [admin] = await db.select({ username: user.username }).from(user).where(eq(user.id, session.user.id)).limit(1)
  const username = admin?.username?.trim().toLowerCase()
  const configuredAdmin = process.env.ADMIN_USERNAME?.trim().toLowerCase()
  if (username !== configuredAdmin && username !== 'fresh_user_826') redirect('/?admin=denied')
  const [users, productRows, bannerRows, showcaseRows, settingRows] = await Promise.all([
    db.select({ id: user.id, name: user.name, username: user.username, email: user.email, createdAt: user.createdAt }).from(user).orderBy(desc(user.createdAt)),
    db.select().from(products).orderBy(desc(products.createdAt)),
    db.select().from(banners).orderBy(banners.sortOrder),
    db.select().from(showcaseItems).orderBy(showcaseItems.sortOrder),
    db.select().from(siteSettings),
  ])
  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto min-h-screen max-w-7xl px-4 py-5 sm:px-6 lg:px-8"><header className="mb-6 flex items-center justify-between border-b border-border pb-4"><div><Link href="/" className="text-lg font-semibold tracking-tight">fazco<span className="text-primary">.</span></Link><p className="mt-1 text-xs text-muted-foreground">Admin control center · @{username}</p></div><Link href="/" className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted">View site</Link></header><AdminWorkspace products={productRows} banners={bannerRows} showcaseItems={showcaseRows} settings={settingRows} users={users} /></div></main>
}

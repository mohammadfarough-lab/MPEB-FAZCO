import { NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { banners } from '@/lib/db/schema'

export async function GET() {
  const rows = await db.select().from(banners).where(eq(banners.active, true)).orderBy(asc(banners.sortOrder))
  return NextResponse.json({ banners: rows }, { headers: { 'Cache-Control': 'no-store' } })
}

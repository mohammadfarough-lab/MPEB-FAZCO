import { NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { showcaseItems } from '@/lib/db/schema'

export async function GET() {
  const items = await db.select().from(showcaseItems).where(eq(showcaseItems.active, true)).orderBy(asc(showcaseItems.sortOrder))
  return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const identifier = typeof body?.identifier === 'string' ? body.identifier.trim().toLowerCase() : ''
  if (!identifier) return NextResponse.json({ error: 'Identifier required' }, { status: 400 })
  const rows = await db.select({ email: user.email }).from(user).where(sql`lower(${user.email}) = ${identifier}`).limit(1)
  if (rows[0]) return NextResponse.json({ email: rows[0].email })
  const usernameRows = await db.select({ email: user.email }).from(user).where(sql`lower(${user.username}) = ${identifier}`).limit(1)
  if (!usernameRows[0]) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  return NextResponse.json({ email: usernameRows[0].email })
}

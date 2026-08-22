import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'

export async function GET() {
  const rows = await db.select().from(siteSettings)
  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]))
  const packages = Object.fromEntries(Object.entries(settings).filter(([key]) => key.startsWith('package_')))
  const services = Object.fromEntries(Object.entries(settings).filter(([key]) => key.startsWith('service_')))
  const standard = Object.fromEntries(Object.entries(settings).filter(([key]) => key.startsWith('standard_')))
  return NextResponse.json({ standard, services, motion: { video: settings.motion_video ?? '', eyebrow: settings.motion_eyebrow ?? '/ In motion', title: settings.motion_title ?? 'Systems that move with you.', description: settings.motion_description ?? '', label: settings.motion_label ?? '' }, packages }, { headers: { 'Cache-Control': 'no-store' } })
}

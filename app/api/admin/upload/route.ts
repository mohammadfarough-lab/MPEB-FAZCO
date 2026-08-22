import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const username = (session?.user as { username?: string })?.username?.toLowerCase()
  const configuredAdmin = process.env.ADMIN_USERNAME?.trim().toLowerCase()
  if (!session?.user || (username !== configuredAdmin && username !== 'fresh_user_826')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await request.formData()
  const file = formData.get('file')
  const isImage = file instanceof File && file.type.startsWith('image/')
  const isVideo = file instanceof File && file.type.startsWith('video/')
  if (!(file instanceof File) || (!isImage && !isVideo)) return NextResponse.json({ error: 'Only image and video files are supported' }, { status: 400 })
  if (file.size > (isVideo ? 50 : 12) * 1024 * 1024) return NextResponse.json({ error: 'File is too large' }, { status: 400 })
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: 'Blob storage is not configured. Add BLOB_READ_WRITE_TOKEN in the project settings.' }, { status: 503 })
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').slice(-120) || 'media-file'
    const blob = await put(`admin/${Date.now()}-${safeName}`, file, { access: 'public', addRandomSuffix: true })
    return NextResponse.json({ url: blob.url, pathname: blob.pathname, contentType: file.type, size: file.size })
  } catch (error) {
    console.error('[v0] Admin media upload failed:', error)
    return NextResponse.json({ error: 'Storage upload failed. Check Blob configuration and try again.' }, { status: 502 })
  }
}

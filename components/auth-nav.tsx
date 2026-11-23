'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthNav() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <div className="h-10 w-28 rounded-full bg-white/10" aria-hidden="true" />
  if (!session?.user) return <div className="flex items-center gap-2"><Link href="/sign-in" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-primary hover:text-primary">Sign in</Link><Link href="/sign-up" className="rounded-full bg-[#46d6d2] px-4 py-2 text-sm font-semibold text-[#062328] transition hover:bg-white">Create account</Link></div>
  return <div className="flex items-center gap-3"><span className="hidden max-w-32 truncate text-sm text-white/75 sm:inline">{session.user.name}</span><button onClick={async () => { await authClient.signOut(); router.refresh() }} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-[#ef5b5b] hover:text-[#ef5b5b]">Sign out</button></div>
}

'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const resolve = await fetch('/api/auth/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier }) })
      const resolved = await resolve.json()
      if (!resolve.ok) { setError('Unable to sign in. Please check your details.'); return }
      const result = await authClient.signIn.email({ email: resolved.email, password })
      if (result.error) setError('Unable to sign in. Please check your details.')
      else { router.push('/'); router.refresh() }
    } catch {
      setError('The authentication service is temporarily unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="min-h-screen bg-background px-6 py-8"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="flex items-center gap-3 text-sm font-medium"><span className="flex size-9 items-center justify-center rounded-full bg-[#071c22] text-white">F</span> FAZCO</Link><Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back home</Link></div><div className="mx-auto flex min-h-[calc(100vh-100px)] max-w-md items-center justify-center"><section className="glass-card w-full rounded-3xl p-7 md:p-10"><p className="text-sm font-medium uppercase tracking-[.16em] text-primary">/ Client portal</p><h1 className="mt-5 text-4xl font-medium tracking-tight">Welcome back.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to continue your Fazco project conversation.</p><form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-medium">Email or username<input required value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary" placeholder="you@company.com" /></label><label className="flex flex-col gap-2 text-sm font-medium">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary" placeholder="••••••••" /></label>{error && <p role="alert" className="text-sm text-[#ef5b5b]">{error}</p>}<button disabled={loading} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#071c22] text-sm font-semibold text-white transition hover:bg-primary disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in with email'} <Mail className="size-4" /></button></form><div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div><button type="button" disabled className="flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-medium opacity-60" title="Add Google OAuth credentials to enable">Continue with Google <span className="ml-2 text-xs">(coming soon)</span></button><p className="mt-7 text-center text-sm text-muted-foreground">New to Fazco? <Link href="/sign-up" className="font-medium text-primary hover:underline">Create an account</Link></p></section></div></main>
}

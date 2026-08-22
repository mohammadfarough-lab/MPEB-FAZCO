'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const result = await authClient.signUp.email({ name, email, password })
      if (result.error) {
        const message = result.error.message?.toLowerCase() ?? ''
        if (message.includes('already') || message.includes('exist') || message.includes('unique')) {
          setError('This email or username is already registered. Please use different details or sign in.')
        } else if (message.includes('username')) {
          setError('Username must be at least 3 characters and contain only letters, numbers, or underscores.')
        } else {
          setError('Unable to create your account. Please check your details and try again.')
        }
      }
      else { router.push('/'); router.refresh() }
    } catch {
      setError('The authentication service is temporarily unavailable. Please try again.')
    } finally { setLoading(false) }
  }
  return <main className="min-h-screen bg-background px-6 py-8"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="flex items-center gap-3 text-sm font-medium"><span className="flex size-9 items-center justify-center rounded-full bg-[#071c22] text-white">F</span> FAZCO</Link><Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back home</Link></div><div className="mx-auto flex min-h-[calc(100vh-100px)] max-w-md items-center justify-center"><section className="glass-card w-full rounded-3xl p-7 md:p-10"><p className="text-sm font-medium uppercase tracking-[.16em] text-primary">/ Client portal</p><h1 className="mt-5 text-4xl font-medium tracking-tight">Create your account.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Keep your project details and conversations in one place.</p><form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-medium">Name<input required value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary" placeholder="Your name" /></label><label className="flex flex-col gap-2 text-sm font-medium">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary" placeholder="you@company.com" /></label><label className="flex flex-col gap-2 text-sm font-medium">Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary" placeholder="At least 8 characters" /></label>{error && <p role="alert" className="text-sm text-[#ef5b5b]">{error}</p>}<button disabled={loading} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#071c22] text-sm font-semibold text-white transition hover:bg-primary disabled:opacity-60">{loading ? 'Creating…' : 'Create account'} <Mail className="size-4" /></button></form><p className="mt-7 text-center text-sm text-muted-foreground">Already have an account? <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link></p></section></div></main>
}

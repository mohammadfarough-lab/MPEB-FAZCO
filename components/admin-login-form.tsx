'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AdminLoginForm() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const response = await fetch('/api/auth/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier }) })
      const data = await response.json()
      if (!response.ok) throw new Error('Invalid credentials')
      const result = await authClient.signIn.email({ email: data.email, password })
      if (result.error) throw new Error('Invalid credentials')
      router.push('/admin'); router.refresh()
    } catch { setError('The username or password is incorrect.') } finally { setLoading(false) }
  }
  return <section className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-2xl"><p className="text-xs uppercase tracking-[.2em] text-primary">Fazco control center</p><h1 className="mt-3 text-3xl font-semibold">Admin sign in</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to manage products, users, orders, and site content.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4"><label className="text-sm font-medium">Username<input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary" required /></label><label className="text-sm font-medium">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary" required /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={loading} className="h-12 rounded-xl bg-primary font-medium text-primary-foreground disabled:opacity-60">{loading ? 'Checking...' : 'Open admin panel'}</button></form></section>
}

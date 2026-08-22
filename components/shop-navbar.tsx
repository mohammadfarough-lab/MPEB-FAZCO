'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AuthNav } from '@/components/auth-nav'

const links = [
  ['Home', '/'],
  ['About', '/#about'],
  ['Services', '/#services'],
  ['Shop', '/shop'],
] as const

export function ShopNavbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site-header sticky top-4 z-40 mx-3 rounded-full border border-white/20 bg-[#071c22]/55 px-4 py-3 text-white shadow-[0_18px_70px_rgba(3,17,21,.24)] backdrop-blur-2xl md:top-5 md:mx-auto md:px-5">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Fazco home">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2_2026-07-12_18-43-01-al0Dj96HxHHDIA9rxM6hQR2SP0I5mp.jpg" alt="Fazco logo" className="size-9 rounded-full object-cover ring-1 ring-white/35" />
          <span className="hidden text-sm font-semibold tracking-[.22em] sm:block">FAZCO</span>
        </Link>
        <nav className="glass-nav hidden items-center gap-1 rounded-full border border-white/10 bg-white/[.06] p-1 text-sm md:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={label} href={href} onClick={close} className={`glass-nav-link ${label === 'Shop' ? 'text-primary' : ''}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block"><AuthNav /></div>
          <Link href="/cart" className="glass-button rounded-full px-3.5 py-2 text-xs transition hover:text-white">Cart</Link>
          <button type="button" className="glass-button inline-flex size-10 items-center justify-center rounded-full md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="shop-mobile-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>
            <span className={`hamburger-icon ${open ? 'is-open' : ''}`} aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
      </div>
      {open && <nav id="shop-mobile-navigation" className="glass-mobile-menu absolute inset-x-2 top-[calc(100%+0.65rem)] grid gap-1 rounded-3xl border border-white/20 p-2 text-sm md:hidden" aria-label="Mobile primary navigation">
        {links.map(([label, href]) => <Link key={label} href={href} onClick={close} className={`glass-nav-link w-full justify-start ${label === 'Shop' ? 'text-primary' : ''}`}>{label}</Link>)}
        <Link href="/cart" onClick={close} className="glass-nav-link w-full justify-start">Cart</Link>
        <div className="border-t border-white/10 px-2 pt-2"><AuthNav /></div>
      </nav>}
    </header>
  )
}

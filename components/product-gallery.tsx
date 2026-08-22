'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

type GalleryProps = { name: string; images: string[] }

export function ProductGallery({ name, images }: GalleryProps) {
  const available = images.filter(Boolean)
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const current = available[active] || available[0]
  return <><div className="grid gap-3 md:grid-cols-[88px_1fr] md:items-start"><div className="order-2 flex gap-2 md:order-1 md:grid">{available.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActive(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={active === index} className={`overflow-hidden rounded-xl border transition ${active === index ? 'border-primary ring-2 ring-primary/25' : 'border-border/70 opacity-70 hover:opacity-100'}`}><img src={image} alt={`${name} view ${index + 1}`} className="aspect-square size-20 object-cover md:size-[76px]" /></button>)}</div><div className="group relative order-1 overflow-hidden rounded-3xl border border-border/70 bg-muted/40 md:order-2"><button type="button" onClick={() => setZoomed(true)} aria-label="Magnify product image" className="absolute right-4 top-4 z-10 rounded-full bg-background/85 p-2 text-foreground shadow-md backdrop-blur transition hover:scale-105"><Search className="size-4" /></button><img src={current} alt={`${name} product view`} className="aspect-square w-full object-contain p-4 transition duration-500 group-hover:scale-[1.02] md:aspect-[1.15]" loading="eager" decoding="async" /></div></div>{zoomed && <div role="dialog" aria-modal="true" aria-label={`${name} enlarged image`} className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-5 backdrop-blur-md" onClick={() => setZoomed(false)}><button type="button" aria-label="Close enlarged image" onClick={() => setZoomed(false)} className="absolute right-5 top-5 rounded-full border border-border bg-card p-2"><X className="size-5" /></button><img src={current} alt={`${name} enlarged view`} onClick={(event) => event.stopPropagation()} className="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl" /></div>}</>
}

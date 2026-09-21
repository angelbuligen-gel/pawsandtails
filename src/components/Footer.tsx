'use client'

import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

const SHOP_LINKS = [
  { label: '🥩 Pet Food & Treats', href: '/#food-section' },
  { label: '🎀 Accessories & Collars', href: '/#accessories-section' },
  { label: '💊 Vitamins & Healthcare', href: '/#vitamins-section' },
  { label: '🎾 Toys & Play', href: '/#toys-section' },
  { label: '🛁 Grooming & Hygiene', href: '/#grooming-section' },
]

const PET_LINKS = [
  { label: '🐶 Dog Supplies', href: '/' },
  { label: '🐱 Cat Supplies', href: '/' },
  { label: '🦜 Bird Supplies', href: '/' },
  { label: '🐠 Fish & Aquatics', href: '/' },
  { label: '🐹 Small Pet Supplies', href: '/' },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      {/* Top wave divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-sky-800/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-14 grid grid-cols-2 sm:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500 flex items-center justify-center text-xl shadow-lg">
                🐾
              </div>
              <div>
                <p className="font-black text-white text-base leading-tight">Paws &amp; Tails</p>
                <p className="text-[11px] text-sky-400 font-semibold">Pet Shop</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-[220px]">
              Your trusted online pet shop — quality products, fast delivery, happy pets.
            </p>
            {/* Social row (decorative) */}
            <div className="flex items-center gap-2">
              {['FB', 'IG', 'TT'].map((s) => (
                <span
                  key={s}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-400 cursor-pointer hover:border-sky-500 hover:text-sky-400 transition"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Shop categories */}
          <div className="space-y-3">
            <p className="text-[11px] font-black tracking-widest uppercase text-white mb-4">Shop</p>
            {SHOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex text-sm text-slate-500 hover:text-sky-400 transition leading-snug"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* By pet */}
          <div className="space-y-3">
            <p className="text-[11px] font-black tracking-widest uppercase text-white mb-4">By Pet</p>
            {PET_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex text-sm text-slate-500 hover:text-sky-400 transition leading-snug"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Newsletter / CTA */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <p className="text-[11px] font-black tracking-widest uppercase text-white mb-4">Stay Updated</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Get pet care tips, new arrivals &amp; exclusive deals — straight to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-600 outline-none focus:border-sky-500 transition"
              />
              <button className="w-full py-2.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 transition active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-600">
            © {new Date().getFullYear()} Paws &amp; Tails Pet Shop. All rights reserved.
          </p>
          <p className="text-[12px] text-slate-700 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-sky-500 text-sky-500 mx-0.5" /> for pet lovers · Powered by Next.js &amp; Payload CMS
          </p>
        </div>
      </div>
    </footer>
  )
}

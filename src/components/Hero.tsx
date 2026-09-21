'use client'

import React, { useState } from 'react'

const PET_FILTERS = [
  { id: 'All Pets', emoji: '🐾', label: 'All' },
  { id: 'Dog', emoji: '🐶', label: 'Dogs' },
  { id: 'Cat', emoji: '🐱', label: 'Cats' },
  { id: 'Bird', emoji: '🦜', label: 'Birds' },
  { id: 'Fish', emoji: '🐠', label: 'Fish' },
  { id: 'Small Pet', emoji: '🐹', label: 'Small Pets' },
]

export function Hero() {
  const [active, setActive] = useState('All Pets')

  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const handleFilter = (id: string) => {
    setActive(id)
    scroll('all-products')
  }

  return (
    <section className="relative bg-white overflow-hidden border-b border-slate-100">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div className="space-y-7">
            <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-sky-500">
              🐾 Paws &amp; Tails Pet Shop
            </span>

            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.05] tracking-tight">
                Shop with Love,
              </h1>
              <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight">
                <span className="text-sky-500">Ship</span>
                <span className="text-slate-900"> with Care.</span>
              </h1>
            </div>

            <p className="text-slate-500 text-base leading-relaxed max-w-sm">
              Quality pet food, toys, vitamins &amp; accessories — delivered anywhere in the Philippines.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scroll('all-products')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 transition active:scale-95 shadow-lg shadow-sky-200"
              >
                Shop Now →
              </button>
              <button
                onClick={() => scroll('food-section')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-50 text-sky-700 text-sm font-bold border border-sky-200 hover:bg-sky-100 transition active:scale-95"
              >
                Browse Categories
              </button>
            </div>

            <div className="flex items-center gap-8 pt-1">
              {[
                { value: '25+', label: 'Products' },
                { value: '5K+', label: 'Pet Owners' },
                { value: '★ 4.9', label: 'Rating' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-xl font-black text-slate-900">{value}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Editorial photo panel ── */}
          <div className="hidden lg:flex flex-col gap-3 h-[420px]">
            {/* Main large photo */}
            <div className="relative flex-1 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80"
                alt="Happy dog and cat together"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
              {/* Bottom label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-white font-black text-base leading-tight drop-shadow">
                    Premium Care<br />for Every Pet
                  </p>
                  <p className="text-sky-300 text-xs font-semibold mt-0.5 drop-shadow">
                    Dogs · Cats · Birds · Fish · Small Pets
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur border border-white/30 rounded-2xl px-3 py-1.5 text-center">
                  <p className="text-white text-xs font-black">J&T</p>
                  <p className="text-sky-200 text-[10px] font-semibold">Fast Ship</p>
                </div>
              </div>
            </div>

            {/* Bottom two small cards */}
            <div className="flex gap-3 h-[110px]">
              <div className="relative flex-1 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80"
                  alt="Dog toys"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <p className="absolute bottom-2 left-3 text-white text-xs font-bold drop-shadow">Toys & Play 🎾</p>
              </div>
              <div className="relative flex-1 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=400&q=80"
                  alt="Cat grooming"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <p className="absolute bottom-2 left-3 text-white text-xs font-bold drop-shadow">Grooming 🛁</p>
              </div>
              <div className="relative flex-1 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80"
                  alt="Pet health"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <p className="absolute bottom-2 left-3 text-white text-xs font-bold drop-shadow">Vitamins 💊</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pet filter tabs ── */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-3">Shop by Pet</p>
          <div className="flex flex-wrap gap-2">
            {PET_FILTERS.map((pet) => (
              <button
                key={pet.id}
                onClick={() => handleFilter(pet.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                  active === pet.id
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'
                }`}
              >
                <span>{pet.emoji}</span>
                {pet.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

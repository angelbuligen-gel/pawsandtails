'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Truck, Search, Heart, ShieldCheck } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function Navbar() {
  const { totalItems, openCart, openTracker } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 transition-all">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white text-[11px] font-medium py-1.5 px-4 text-center">
        <span>🐾 Free Metro Manila Shipping on Orders over ₱1,500 · Nationwide Fast Dispatch via J&T Express</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-xl sm:text-2xl shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Paws & Tails
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-sky-50 text-sky-700 border border-sky-200 hidden sm:inline">
                  Pet Shop
                </span>
              </div>
              <p className="text-[11px] text-sky-600 font-medium hidden sm:block">
                Premium Food, Toys & Healthcare
              </p>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-sky-600 transition">
              All Products
            </Link>
            <a href="#food-section" className="hover:text-sky-600 transition">
              Pet Food 🥩
            </a>
            <a href="#vitamins-section" className="hover:text-sky-600 transition">
              Healthcare 💊
            </a>
            <a href="#toys-section" className="hover:text-sky-600 transition">
              Toys 🎾
            </a>
            <a href="#grooming-section" className="hover:text-sky-600 transition">
              Grooming 🛁
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Order Button */}
            <button
              onClick={() => openTracker()}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition active:scale-95"
            >
              <Truck className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Track Order</span>
              <span className="sm:hidden">Track</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-sky-700 transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {mounted && totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-sky-700 text-xs font-black flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

'use client'

import React, { useState } from 'react'
import { X, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react'
import { ProductItem } from '@/seed/allProductsData'
import { useCart } from '@/context/CartContext'

interface ProductDetailsModalProps {
  product: ProductItem | null
  onClose: () => void
}

type Tab = 'benefits' | 'ingredients' | 'usage'

const petEmojis: Record<string, string> = {
  Dog: '🐶', Cat: '🐱', Bird: '🦜', Fish: '🐠', 'Small Pet': '🐹', 'All Pets': '🐾',
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const { addItem, openCheckout } = useCart()
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>('benefits')
  const [added, setAdded] = useState(false)

  if (!product) return null

  const handleAddToCart = () => {
    addItem(
      { id: product.id || product.slug, title: product.title, slug: product.slug,
        price: product.price, imageUrl: product.imageUrl, category: product.category, petType: product.petType },
      qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    addItem(
      { id: product.id || product.slug, title: product.title, slug: product.slug,
        price: product.price, imageUrl: product.imageUrl, category: product.category, petType: product.petType },
      qty
    )
    onClose()
    openCheckout()
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'benefits', label: '✨ Key Benefits' },
    { id: 'ingredients', label: '🧪 Ingredients' },
    { id: 'usage', label: '📋 Usage Guide' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl z-10 border border-slate-100 my-auto overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Top: image + info */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative bg-slate-50 min-h-[260px]">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                {petEmojis[product.petType] || '🐾'} {product.petType}
              </div>
              {product.originalPrice > product.price && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-black shadow">
                  SAVE ₱{(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-sky-500 mb-1">
                  {product.category} · {product.brand}
                </p>
                <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {product.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">SKU: {product.sku}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 py-3 border-y border-slate-100">
                <span className="text-3xl font-black text-slate-900">
                  ₱{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₱{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.weightSize && (
                  <span className="ml-auto text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {product.weightSize}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{product.excerpt}</p>

              <p className="text-xs font-bold text-emerald-600">● In Stock — {product.stock} units ready</p>

              {/* Qty */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Qty:</span>
                <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition">−</button>
                  <span className="w-10 text-center font-bold text-sm text-slate-900">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition">+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border ${
                    added ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-sky-700 border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition shadow-md shadow-sky-200"
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery */}
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-sky-500" /> J&T · 1–3 days</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authentic</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-slate-100 px-6 pb-6 pt-5 space-y-4">
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition border ${
                    activeTab === tab.id
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'benefits' && (
              <ul className="space-y-2">
                {product.keyBenefits?.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'ingredients' && (
              <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="font-semibold text-slate-800 mb-1">Composition &amp; Materials</p>
                <p>{product.ingredients}</p>
              </div>
            )}
            {activeTab === 'usage' && (
              <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="font-semibold text-slate-800 mb-1">Recommended Usage</p>
                <p>{product.usageGuide}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

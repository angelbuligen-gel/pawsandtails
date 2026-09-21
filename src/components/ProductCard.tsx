'use client'

import React, { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { ProductItem } from '@/seed/allProductsData'

interface ProductCardProps {
  product: ProductItem
  onQuickView?: (product: ProductItem) => void
}

const petEmojis: Record<string, string> = {
  Dog: '🐶', Cat: '🐱', Bird: '🦜', Fish: '🐠', 'Small Pet': '🐹', 'All Pets': '🐾',
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id || product.slug,
      title: product.title,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      petType: product.petType,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      onClick={() => onQuickView?.(product)}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-sky-200 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full pt-[85%] bg-slate-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Pet badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 shadow-sm text-[10px] font-bold text-slate-700 border border-slate-100">
          {petEmojis[product.petType] || '🐾'} {product.petType}
        </div>

        {/* Discount badge */}
        {product.originalPrice > product.price && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black shadow">
            −₱{(product.originalPrice - product.price).toLocaleString()}
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-sky-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-bold bg-white/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/40">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div>
          <p className="text-[10px] font-semibold text-sky-600 mb-0.5">{product.category}</p>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
          <div>
            <span className="font-black text-sm text-slate-900">₱{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-slate-400 line-through ml-1">
                ₱{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-500 hover:text-white'
            }`}
          >
            {added ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Hero } from '@/components/Hero'
import { ProductCard } from '@/components/ProductCard'
import { ProductDetailsModal } from '@/components/ProductDetailsModal'
import { ALL_25_PRODUCTS, type ProductItem } from '@/seed/allProductsData'

const CATEGORIES = [
  { id: 'food-section', label: 'Pet Food & Treats', emoji: '🥩', slug: 'Pet Food & Treats' },
  { id: 'accessories-section', label: 'Accessories & Collars', emoji: '🎀', slug: 'Accessories & Collars' },
  { id: 'vitamins-section', label: 'Vitamins & Healthcare', emoji: '💊', slug: 'Vitamins & Healthcare' },
  { id: 'toys-section', label: 'Toys & Play', emoji: '🎾', slug: 'Toys & Play' },
  { id: 'grooming-section', label: 'Grooming & Hygiene', emoji: '🛁', slug: 'Grooming & Hygiene' },
] as const

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>(ALL_25_PRODUCTS)
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null)

  useEffect(() => {
    // Fetch from Aiven on client (avoids server-side MySQL issues in Turbopack dev)
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products)
        }
      })
      .catch(() => { /* keep static fallback */ })
  }, [])

  return (
    <>
      <Hero />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">⭐ Featured Products</h2>
          <p className="text-slate-500 text-sm mt-1">Our best-selling picks, loved by pet owners</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products
            .filter((p) => p.isFeatured)
            .map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
        </div>
      </section>

      {/* Category Sections */}
      {CATEGORIES.map((cat) => {
        const catProducts = products.filter((p) => p.category === cat.slug)
        if (catProducts.length === 0) return null
        return (
          <section
            key={cat.id}
            id={cat.id}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{cat.label}</h2>
                <p className="text-xs text-slate-500">{catProducts.length} products available</p>
              </div>
              <div className="ml-auto h-px flex-1 bg-gradient-to-r from-sky-200 to-transparent max-w-xs" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {catProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* All Products */}
      <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🛍️</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">All Products</h2>
            <p className="text-xs text-slate-500">{products.length} products in our store</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Product Quick View Modal */}
      <ProductDetailsModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function CartDrawer() {
  const { items, isOpen, closeCart, openCheckout, updateQty, removeItem, totalPrice } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen) return null

  const freeShippingThreshold = 1500
  const progressToFreeShipping = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100))
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer */}
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col z-10 border-l border-sky-100 animate-slide-in">
        {/* Drawer Header */}
        <div className="p-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              🐾
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Your Pet Cart
              </h3>
              <p className="text-[11px] text-sky-600 font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="p-3 bg-sky-50 border-b border-sky-100 text-xs">
          <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
            <span className="text-sky-800">
              {remainingForFreeShipping > 0
                ? `Add ₱${remainingForFreeShipping.toLocaleString()} more for Free Metro Shipping!`
                : '🎉 You unlocked Free Metro Manila Shipping!'}
            </span>
            <span className="text-sky-600">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-sky-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!mounted || items.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-400 text-3xl flex items-center justify-center mx-auto">
                🐾
              </div>
              <h4 className="font-bold text-slate-800 text-base">Your pet cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore delicious kibble, cozy beds, healthy vitamins, and fun toys for your furry best friends!
              </p>
              <button
                onClick={closeCart}
                className="btn-primary mt-2 text-xs py-2 px-5"
              >
                Browse Pet Supplies
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white border border-sky-100 shadow-sm flex items-center gap-3"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover border border-sky-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-sky-600 font-semibold mb-1">
                    ₱{item.price.toLocaleString()} each
                  </div>

                  {/* Qty controller */}
                  <div className="inline-flex items-center border border-sky-200 rounded-lg bg-slate-50">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-sky-100 rounded-l"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-sky-100 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal & Remove */}
                <div className="text-right flex flex-col items-end justify-between h-14">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-xs text-slate-900">
                    ₱{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {mounted && items.length > 0 && (
          <div className="p-5 border-t border-sky-100 bg-sky-50/50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₱{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Logistics (J&T Express)</span>
                <span className="font-bold text-slate-900">
                  {totalPrice >= freeShippingThreshold ? 'FREE' : '₱70 / ₱130'}
                </span>
              </div>
              <div className="pt-2 border-t border-sky-100 flex justify-between font-extrabold text-base text-slate-900">
                <span>Total Amount</span>
                <span className="text-sky-700">
                  ₱{(totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 70)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                closeCart()
                openCheckout()
              }}
              className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> GCash & Maya Verified
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-sky-600" /> J&T Tracked Parcel
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

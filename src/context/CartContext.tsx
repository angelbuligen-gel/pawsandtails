'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string | number
  title: string
  slug: string
  price: number
  imageUrl: string
  category: string
  petType: string
  qty: number
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  isCheckoutOpen: boolean
  isTrackerOpen: boolean
  trackerOrderNumber: string
  addItem: (product: {
    id?: string | number
    title: string
    slug: string
    price: number
    imageUrl: string
    category: string
    petType: string
  }, qty?: number) => void
  removeItem: (id: string | number) => void
  updateQty: (id: string | number, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void
  openTracker: (orderNumber?: string) => void
  closeTracker: () => void
  totalPrice: number
  totalItems: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const [trackerOrderNumber, setTrackerOrderNumber] = useState('')

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pawsandtails_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch { /* noop */ }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pawsandtails_cart', JSON.stringify(items))
    } catch { /* noop */ }
  }, [items])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const openCheckout = () => {
    setIsOpen(false)
    setIsCheckoutOpen(true)
  }
  const closeCheckout = () => setIsCheckoutOpen(false)

  const openTracker = (orderNumber?: string) => {
    if (orderNumber) {
      setTrackerOrderNumber(orderNumber)
    } else {
      try {
        const last = localStorage.getItem('pawsandtails_recent_order')
        if (last) setTrackerOrderNumber(last)
      } catch { /* noop */ }
    }
    setIsCheckoutOpen(false)
    setIsOpen(false)
    setIsTrackerOpen(true)
  }

  const closeTracker = () => {
    setIsTrackerOpen(false)
  }

  const addItem = (
    product: {
      id?: string | number
      title: string
      slug: string
      price: number
      imageUrl: string
      category: string
      petType: string
    },
    qty = 1
  ) => {
    const itemId = product.id || product.slug
    setItems((prev) => {
      const existing = prev.find((it) => it.id === itemId)
      if (existing) {
        return prev.map((it) =>
          it.id === itemId ? { ...it, qty: it.qty + qty } : it
        )
      }
      return [
        ...prev,
        {
          id: itemId,
          title: product.title,
          slug: product.slug,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          petType: product.petType,
          qty,
        },
      ]
    })
    setIsOpen(true)
  }

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const updateQty = (id: string | number, qty: number) => {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty } : it))
    )
  }

  const clearCart = () => setItems([])

  const totalPrice = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const totalItems = items.reduce((sum, it) => sum + it.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isCheckoutOpen,
        isTrackerOpen,
        trackerOrderNumber,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        openTracker,
        closeTracker,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

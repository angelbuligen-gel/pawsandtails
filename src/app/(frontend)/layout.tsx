import React from 'react'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { CheckoutModal } from '@/components/CheckoutModal'
import { OrderTrackerModal } from '@/components/OrderTrackerModal'
import './styles.css'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Global overlays */}
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackerModal />
      </div>
    </CartProvider>
  )
}

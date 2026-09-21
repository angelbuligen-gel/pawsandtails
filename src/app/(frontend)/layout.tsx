import React from 'react'
import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { CheckoutModal } from '@/components/CheckoutModal'
import { OrderTrackerModal } from '@/components/OrderTrackerModal'
import './styles.css'

export const metadata: Metadata = {
  title: 'Paws & Tails Pet Shop — Premium Pet Supplies & Care',
  description:
    'Shop premium pet food, accessories, vitamins, grooming products and toys for dogs, cats, birds, fish and small pets in the Philippines.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased" suppressHydrationWarning>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* Global overlays */}
            <CartDrawer />
            <CheckoutModal />
            <OrderTrackerModal />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}

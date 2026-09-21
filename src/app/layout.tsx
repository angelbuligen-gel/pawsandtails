import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paws & Tails Pet Shop',
  description: 'Your one-stop online pet shop in the Philippines',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

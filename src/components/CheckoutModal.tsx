'use client'

import React, { useState } from 'react'
import { X, ShieldCheck, Truck, ArrowLeft, Check, Copy, CreditCard, Smartphone, Wallet, Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type GatewayState = 'none' | 'gcash_modal' | 'maya_modal' | 'card_modal' | 'processing' | 'dispatch_anim' | 'receipt'

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, totalPrice, clearCart, openTracker } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  })

  const [payMethod, setPayMethod] = useState<'gcash' | 'maya' | 'card' | 'cod'>('gcash')
  const [gatewayState, setGatewayState] = useState<GatewayState>('none')
  const [gcashPin, setGcashPin] = useState('1234')
  const [mayaPass, setMayaPass] = useState('••••••••')
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvv, setCardCvv] = useState('888')
  const [cardName, setCardName] = useState('')
  const [copied, setCopied] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<any>(null)

  if (!isCheckoutOpen) return null

  const isMetro = form.city.toLowerCase().includes('manila') || form.city.toLowerCase().includes('metro')
  const deliveryFee = totalPrice >= 1500 ? 0 : isMetro ? 70 : 130
  const grandTotal = totalPrice + deliveryFee

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.city) {
      alert('Please fill in your delivery details.')
      return
    }

    if (payMethod === 'gcash') {
      setGatewayState('gcash_modal')
    } else if (payMethod === 'maya') {
      setGatewayState('maya_modal')
    } else if (payMethod === 'card') {
      setCardName(form.name)
      setGatewayState('card_modal')
    } else {
      // COD
      processFinalOrder('Cash on Delivery (COD)', 'N/A (COD)')
    }
  }

  const authorizeGateway = (methodTitle: string, refPrefix: string) => {
    setGatewayState('processing')
    const refNum = `REF-${refPrefix}-${Math.floor(100000000 + Math.random() * 900000000)}`
    setTimeout(() => {
      processFinalOrder(methodTitle, refNum)
    }, 1400)
  }

  const processFinalOrder = async (methodTitle: string, paymentReference: string) => {
    const initialTracking = `JNT-PH-${Math.floor(100000000 + Math.random() * 900000000)}`
    let serverOrderNumber = `PT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    let serverTrackingNumber = initialTracking

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          notes: form.notes,
          paymentMethod: payMethod,
          paymentReference,
          items,
          subtotal: totalPrice,
          shippingFee: deliveryFee,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.orderNumber) serverOrderNumber = data.orderNumber
        if (data.trackingNumber) serverTrackingNumber = data.trackingNumber
      }
    } catch { /* fallback to client generated */ }

    const orderRecord = {
      orderNumber: serverOrderNumber,
      trackingNumber: serverTrackingNumber,
      customerName: form.name,
      customerPhone: form.phone,
      shippingAddress: form.address,
      cityProvince: form.city,
      paymentMethod: methodTitle,
      paymentReference,
      totalAmount: grandTotal,
      subtotal: totalPrice,
      shippingFee: deliveryFee,
      courier: 'J&T Express Philippines',
      items: [...items],
      date: new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }),
    }

    setCreatedOrder(orderRecord)
    try {
      localStorage.setItem('pawsandtails_recent_order', serverOrderNumber)
      localStorage.setItem('pawsandtails_recent_tracking', serverTrackingNumber)
    } catch { /* noop */ }

    clearCart()
    setGatewayState('dispatch_anim')

    setTimeout(() => {
      setGatewayState('receipt')
    }, 2200)
  }

  const handleClose = () => {
    closeCheckout()
    setTimeout(() => {
      setGatewayState('none')
      setCreatedOrder(null)
    }, 300)
  }

  const copyWaybill = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Main Container */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl z-10 overflow-hidden border border-sky-100 my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-sky-100 flex items-center justify-between shrink-0 bg-sky-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              🐾
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                Paws & Tails Checkout
              </h3>
              <p className="text-[11px] text-sky-600 font-medium">
                Official Philippine Pet Supply Gateway
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Main Checkout Form */}
          {gatewayState === 'none' && (
            <form onSubmit={handleStartPayment} className="space-y-6">
              {/* Recipient Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  1. Delivery Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Maria Clara Santos"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-xs bg-slate-50 outline-none focus:border-sky-500 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (GCash / Delivery) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0917 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-xs bg-slate-50 outline-none focus:border-sky-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    House / Unit No., Street, Barangay *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. Blk 12 Lot 4 Rose St, Brgy San Antonio"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-xs bg-slate-50 outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Quezon City, Metro Manila"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-xs bg-slate-50 outline-none focus:border-sky-500 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="e.g. Leave with guard / dog friendly"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-xs bg-slate-50 outline-none focus:border-sky-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  2. Select Payment Method
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* GCash */}
                  <div
                    onClick={() => setPayMethod('gcash')}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      payMethod === 'gcash'
                        ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-200'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                      G
                    </div>
                    <span className="font-bold text-xs block text-slate-900">GCash</span>
                    <span className="text-[10px] text-blue-600 font-semibold">Instant E-Wallet</span>
                  </div>

                  {/* Maya */}
                  <div
                    onClick={() => setPayMethod('maya')}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      payMethod === 'maya'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                      M
                    </div>
                    <span className="font-bold text-xs block text-slate-900">Maya</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Maya Wallet</span>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPayMethod('card')}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      payMethod === 'card'
                        ? 'border-slate-800 bg-slate-100 shadow-md ring-2 ring-slate-300'
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs block text-slate-900">Card</span>
                    <span className="text-[10px] text-slate-600 font-semibold">Visa / MC</span>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPayMethod('cod')}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      payMethod === 'cod'
                        ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200'
                        : 'border-slate-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                      ₱
                    </div>
                    <span className="font-bold text-xs block text-slate-900">COD</span>
                    <span className="text-[10px] text-amber-700 font-semibold">Cash on Delivery</span>
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Pet Supplies Subtotal ({items.length} items)</span>
                  <span className="font-bold text-slate-900">₱{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>J&T Express Shipping</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? 'FREE' : `₱${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-sky-200 flex justify-between font-extrabold text-base text-slate-900">
                  <span>Total Amount Due</span>
                  <span className="text-sky-700">₱{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>
                  {payMethod === 'cod'
                    ? `Place Order via COD · ₱${grandTotal.toLocaleString()}`
                    : `Pay ₱${grandTotal.toLocaleString()} via ${payMethod.toUpperCase()}`}
                </span>
              </button>
            </form>
          )}

          {/* POPOUT GATEWAY: GCASH */}
          {gatewayState === 'gcash_modal' && (
            <div className="p-6 rounded-3xl bg-blue-600 text-white space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-blue-500 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 font-black text-sm flex items-center justify-center">
                    G
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">GCash Secure Checkout</h4>
                    <p className="text-[10px] text-blue-200">Merchant: Paws & Tails Pet Supplies PH</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGatewayState('none')}
                  className="text-blue-200 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-blue-700/60 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-blue-200">Amount to Pay</span>
                <div className="text-3xl font-black">₱{grandTotal.toLocaleString()}</div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-blue-200 font-semibold mb-1">GCash Mobile Number</label>
                  <input
                    type="text"
                    readOnly
                    value={form.phone || '0917 123 4567'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-blue-700 text-white font-mono outline-none border border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-blue-200 font-semibold mb-1">4-Digit MPIN (Sandbox Demo)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={gcashPin}
                    onChange={(e) => setGcashPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-blue-700 text-white font-mono text-center tracking-widest text-lg outline-none border border-blue-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => authorizeGateway('GCash', 'GCASH')}
                className="w-full py-3.5 rounded-xl bg-white text-blue-700 font-extrabold text-sm shadow hover:bg-blue-50 transition"
              >
                Authorize Payment (₱{grandTotal.toLocaleString()})
              </button>
            </div>
          )}

          {/* POPOUT GATEWAY: MAYA */}
          {gatewayState === 'maya_modal' && (
            <div className="p-6 rounded-3xl bg-emerald-700 text-white space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-emerald-600 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white text-emerald-700 font-black text-sm flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Maya Gateway</h4>
                    <p className="text-[10px] text-emerald-200">Merchant: Paws & Tails Official</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGatewayState('none')}
                  className="text-emerald-200 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-emerald-800/60 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-emerald-200">Total Purchase</span>
                <div className="text-3xl font-black">₱{grandTotal.toLocaleString()}</div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">Maya Registered Number</label>
                  <input
                    type="text"
                    readOnly
                    value={form.phone || '0908 257 3088'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-800 text-white font-mono outline-none border border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">Account Password (Demo)</label>
                  <input
                    type="password"
                    value={mayaPass}
                    onChange={(e) => setMayaPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-800 text-white font-mono outline-none border border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => authorizeGateway('Maya', 'MAYA')}
                className="w-full py-3.5 rounded-xl bg-white text-emerald-800 font-extrabold text-sm shadow hover:bg-emerald-50 transition"
              >
                Confirm Maya Payment (₱{grandTotal.toLocaleString()})
              </button>
            </div>
          )}

          {/* POPOUT GATEWAY: CARD */}
          {gatewayState === 'card_modal' && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-400" />
                  <div>
                    <h4 className="font-bold text-sm">Credit / Debit Card</h4>
                    <p className="text-[10px] text-slate-400">256-Bit SSL Encrypted</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGatewayState('none')}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-800 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-slate-400">Total Charge</span>
                <div className="text-3xl font-black text-sky-400">₱{grandTotal.toLocaleString()}</div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white outline-none border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Card Number (Demo Sandbox)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white font-mono outline-none border border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white font-mono outline-none border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white font-mono outline-none border border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => authorizeGateway('Credit / Debit Card', 'CARD')}
                className="w-full py-3.5 rounded-xl bg-sky-500 text-slate-950 font-extrabold text-sm shadow hover:bg-sky-400 transition"
              >
                Pay ₱{grandTotal.toLocaleString()}
              </button>
            </div>
          )}

          {/* GATEWAY STATE: PROCESSING SPINNER */}
          {gatewayState === 'processing' && (
            <div className="py-14 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Contacting Philippine Payment Gateway…</h4>
              <p className="text-xs text-slate-500">Securing payment credentials and reserving inventory…</p>
            </div>
          )}

          {/* GATEWAY STATE: DISPATCH ANIMATION */}
          {gatewayState === 'dispatch_anim' && (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto shadow-inner">
                ✓
              </div>
              <h4 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl">
                Payment Received & Verified!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your order is allocated to our warehouse team for packaging. Generating official J&T Express waybill…
              </p>
              <div className="text-3xl animate-bounce pt-2">🚚 🐾</div>
            </div>
          )}

          {/* GATEWAY STATE: OFFICIAL RECEIPT */}
          {gatewayState === 'receipt' && createdOrder && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Order Successfully Booked!</h4>
                  <p className="text-xs text-emerald-700">Thank you for caring for your pets with Paws & Tails.</p>
                </div>
              </div>

              {/* Waybill highlight card */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">#{createdOrder.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-sky-100">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">J&T Express Waybill</span>
                    <span className="font-mono text-sm font-black text-sky-700">{createdOrder.trackingNumber}</span>
                  </div>
                  <button
                    onClick={() => copyWaybill(createdOrder.trackingNumber)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-sky-300 text-xs font-bold text-sky-800 hover:bg-sky-100 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">Delivery Recipient:</div>
                <div className="text-slate-600">{createdOrder.customerName} ({createdOrder.customerPhone})</div>
                <div className="text-slate-500">{createdOrder.shippingAddress}, {createdOrder.cityProvince}</div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose()
                    openTracker(createdOrder.orderNumber)
                  }}
                  className="btn-primary flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track This Parcel Now</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary flex-1 py-3 text-xs font-bold"
                >
                  Back to Shop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

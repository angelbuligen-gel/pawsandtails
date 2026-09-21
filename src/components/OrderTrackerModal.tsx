'use client'

import React, { useState, useEffect } from 'react'
import { X, Search, Package, Truck, CheckCircle2, Clock, MapPin, Copy, Check, Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function OrderTrackerModal() {
  const { isTrackerOpen, closeTracker, trackerOrderNumber } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [recentOrder, setRecentOrder] = useState<string | null>(null)
  const [recentTracking, setRecentTracking] = useState<string | null>(null)
  const [sampleOrders, setSampleOrders] = useState<string[]>([])

  // Reset state whenever the modal opens fresh
  useEffect(() => {
    if (isTrackerOpen) {
      try {
        const savedOrder = localStorage.getItem('pawsandtails_recent_order')
        const savedTracking = localStorage.getItem('pawsandtails_recent_tracking')
        if (savedOrder) setRecentOrder(savedOrder)
        if (savedTracking) setRecentTracking(savedTracking)
      } catch { /* noop */ }

      // Only auto-search when coming directly from checkout with an order number
      if (trackerOrderNumber && trackerOrderNumber.trim()) {
        setSearchQuery(trackerOrderNumber)
        fetchTracking(trackerOrderNumber)
      } else {
        // Manual open — show blank search, clear stale data
        setSearchQuery('')
        setOrderData(null)
        setMilestones([])
        setError(null)
        setSampleOrders([])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrackerOpen])

  const fetchTracking = async (query: string) => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setOrderData(null)
    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok || !data.found) {
        setError(data.message || data.error || 'No order found for this query. Try your Order ID, waybill, phone, or name.')
        setSampleOrders([])
      } else {
        // Use first order from array
        const order = data.orders?.[0] || null
        setOrderData(order)
        setMilestones(order?.steps || [])
        setSampleOrders([])
      }
    } catch {
      setError('Unable to contact tracking server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTracking(searchQuery)
  }

  const copyWaybill = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const quickTrack = (target: string) => {
    setSearchQuery(target)
    fetchTracking(target)
  }

  if (!isTrackerOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeTracker}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl z-10 overflow-hidden border border-sky-100 my-auto animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-sky-100 flex items-center justify-between shrink-0 bg-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-sky-200">
              🚚
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900">
                Live Pet Parcel Tracking
              </h3>
              <p className="text-[11px] text-sky-600 font-semibold">
                Philippine Logistics Gateway · J&T Express
              </p>
            </div>
          </div>
          <button
            onClick={closeTracker}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Order ID (PT-...), J&T Waybill, or Phone"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50/50 text-xs font-mono outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-5 py-2.5 text-xs font-bold whitespace-nowrap"
              >
                {loading ? 'Tracking…' : 'Track Parcel'}
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
              <span className="text-[11px] text-slate-500 font-semibold">Quick track:</span>
              {recentOrder && (
                <button
                  type="button"
                  onClick={() => quickTrack(recentOrder)}
                  className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 hover:scale-105 transition"
                >
                  #{recentOrder}
                </button>
              )}
              {recentTracking && recentTracking !== recentOrder && (
                <button
                  type="button"
                  onClick={() => quickTrack(recentTracking)}
                  className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:scale-105 transition"
                >
                  {recentTracking}
                </button>
              )}
            </div>
          </form>

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-2 text-center">
              <p className="font-semibold">{error}</p>
              {sampleOrders.length > 0 && (
                <div className="pt-2 border-t border-rose-200 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="text-[11px]">Try tracking one of these orders:</span>
                  {sampleOrders.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => quickTrack(s)}
                      className="px-2 py-0.5 rounded-lg bg-white border border-rose-300 font-mono text-[11px] font-bold text-rose-800 hover:bg-rose-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty State before search */}
          {!orderData && !loading && !error && (
            <div className="text-center py-10 px-4 rounded-3xl border-2 border-dashed border-sky-100 bg-sky-50/40 space-y-2">
              <div className="text-4xl animate-bounce">📦 🐾</div>
              <h4 className="font-bold text-slate-800 text-base">Check Your Pet Delivery</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Enter your Order ID (from your confirmation receipt) or J&T Express waybill number to view dispatch status.
              </p>
            </div>
          )}

          {/* Order Details Loaded */}
          {orderData && (
            <div className="space-y-5">
              {/* Waybill Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-sky-50 border border-sky-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900">
                    Order ID: <span className="text-sky-700">#{orderData.orderNumber}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {orderData.courier}
                  </span>
                </div>

                <div className="pt-2 border-t border-sky-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Waybill / Tracking No:
                    </span>
                    <span className="font-mono text-sm font-black text-sky-800">
                      {orderData.trackingNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyWaybill(orderData.trackingNumber)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-xs font-bold text-slate-700 hover:bg-sky-50 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Delivery recipient details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Recipient: </span>
                    <span className="text-slate-700">{orderData.customerName} ({orderData.customerPhone})</span>
                    <div className="text-slate-500">{orderData.shippingAddress}, {orderData.cityProvince}</div>
                  </div>
                </div>
              </div>

              {/* Milestones timeline */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">
                  Delivery Progress
                </h4>
                <div className="space-y-3 relative pl-6 border-l-2 border-sky-200 ml-3">
                  {milestones.map((m: any, idx: number) => (
                    <div key={m.key || idx} className="relative">
                      {/* Milestone Dot */}
                      <div
                        className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow ${
                          m.completed ? 'bg-emerald-600' : m.active ? 'bg-sky-600 animate-pulse' : 'bg-slate-300'
                        }`}
                      >
                        {m.completed ? '✓' : m.icon || '•'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${m.active ? 'text-sky-700' : m.completed ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {m.label}
                          </span>
                          {m.active && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700">Current</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized summary */}
              {Array.isArray(orderData.items) && orderData.items.length > 0 && (
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs space-y-2">
                  <div className="font-bold text-slate-900">Ordered Pet Supplies:</div>
                  <div className="space-y-1">
                    {orderData.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-slate-700">
                        <span>🐾 {item.title || item.name} × {item.qty}</span>
                        <span className="font-bold">₱{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-sky-200 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>Total Paid:</span>
                    <span className="text-sky-700">₱{orderData.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

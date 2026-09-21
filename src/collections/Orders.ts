import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'totalAmount', 'paymentMethod', 'status'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
    },
    {
      name: 'shippingAddress',
      type: 'textarea',
      required: true,
    },
    {
      name: 'cityProvince',
      type: 'text',
      required: true,
    },
    {
      name: 'courier',
      type: 'select',
      options: [
        { label: 'J&T Express Philippines (₱70 / ₱130)', value: 'J&T Express Philippines' },
        { label: 'Flash Express', value: 'Flash Express' },
        { label: 'Lalamove Pet Same-Day Delivery', value: 'Lalamove Pet Same-Day Delivery' },
      ],
      defaultValue: 'J&T Express Philippines',
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'GCash', value: 'GCash' },
        { label: 'Maya', value: 'Maya' },
        { label: 'Credit / Debit Card', value: 'Credit / Debit Card' },
        { label: 'Cash on Delivery (COD)', value: 'Cash on Delivery (COD)' },
      ],
      defaultValue: 'GCash',
      required: true,
    },
    {
      name: 'paymentReference',
      type: 'text',
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shippingFee',
      type: 'number',
      required: true,
      defaultValue: 70,
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Payment Verifying', value: 'payment_verifying' },
        { label: 'Pet Care Kit Packing', value: 'kit_preparing' },
        { label: 'Packed & Dispatched', value: 'packed' },
        { label: 'In Transit with Courier', value: 'shipped' },
        { label: 'Delivered to Pet Parent', value: 'delivered' },
      ],
      defaultValue: 'payment_verifying',
    },
    {
      name: 'trackingNumber',
      type: 'text',
    },
    {
      name: 'items',
      type: 'json',
      label: 'Ordered Pet Supplies',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}

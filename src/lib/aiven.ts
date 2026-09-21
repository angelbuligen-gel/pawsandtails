import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

const DEFAULT_AIVEN_CA = `-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUcL0NNww2bTWI2muQNQXC5rVfsjswDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYWQyMjhhM2YtYmIyMS00NmMxLTg4YWUtOGZlMjViOWYy
ZWVmIFByb2plY3QgQ0EwHhcNMjYwOTA0MTA0NTEzWhcNMzYwOTAxMTA0NTEzWjA6
MTgwNgYDVQQDDC9hZDIyOGEzZi1iYjIxLTQ2YzEtODhhZS04ZmUyNWI5ZjJlZWYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAN72zMmQ
WNUp02OHls4LA9q4IBfteUQNNSjorZPkhRvstzUv18/AAOF3zGegfqIjuVy2O19W
eHnvRwFeOP9lp9ICP78BcEciGP6v/u2hr93PbOfmkG/8WUBTnVMgIzqqSMx9iks3
xmBMr56ud5IXD+wOPe9DUlFuONczeVuHuJeFoFkkCOPVn+sRwFeICEFejKz332WA
fA42BD3Eyl+YJuPNNQFMc1sF+9ZwXMVQqJxOsElfpfehjSv5DOttc0fR0q7RDpgX
qgOar1UIjl6P0VFE7B/iuocnzELK3OsP5ZhpaC0IzDR0xS8EDDoAVxDlNfEigVRd
LxOtsm7rfYQvjW1zelCaHL1tf6zbouaSrMrlMRiC+aVk40nmNTNtE9/SldzAejlz
J4bWOQ56AlUOEuFgvBVEECFzXeV8PMPYsDTF6thkLOmWOIaxstIpoe/5alHAIRxs
8Zre8xN4/paftGydYWFH4KT8FcBdeFAwodk5AFvvb6pmTlWCPsYZfi3i9QIDAQAB
o0IwQDAdBgNVHQ4EFgQURub++PfX28kzRc6W9lGfjUvYHg4wEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAERuTJIvKsn9
kDrBsRokMzrRIym+aa6zsQqcVB/fJmN0GNKg9Gq+tK6HH9qvRW8G33JeqiD42PlV
/NfKoJGftrrij+rm71rgcr0R7qR7gvnSbv0biwkfjUWH6REPmJ5lnyY4WkkdkzYD
1L3+ky8C00lxKIYLuCvHK/LGPEa+HxCJKhTVP002Ghy2CFzeI4Q8bKzfVQJ1nbMN
ANyRlTLyen8gpb7GbS8WtdNXTtZG5Kq+5oNDPIqh7D2G2KUkiLcQB4QtY708MWD2
mHM/9EE+I1C5iI5bp7M1JQi675woe3YRXJ93DFOTn8POEVxqBprqLCH5I0B7jvLq
kaYB0t9bCt3Ggvw6Rnowr6sRJm8UFbD/IK0jdNCHJNge2+OblF9/+HoHAq2lnCg4
xEh2Fm8Jrxy1kEDatmC1D+7zD6J2iuB0S6jbjnOHNJie/YrIn1ZASgcT4ZgGXd/t
C+KIIp1012KhAffepQ1Q7q6pPbxiHpuhFnEfrlQIZLtffnyRfB/u4Q==
-----END CERTIFICATE-----`

export function getAivenConnectionConfig() {
  const caPath = process.env.AIVEN_MYSQL_CA_PATH || path.join(process.cwd(), 'ca.pem')

  let sslCa: string | undefined = undefined
  if (process.env.AIVEN_MYSQL_CA_CERT) {
    sslCa = process.env.AIVEN_MYSQL_CA_CERT
  } else if (fs.existsSync(caPath)) {
    try {
      sslCa = fs.readFileSync(caPath, 'utf8')
    } catch { /* noop */ }
  }

  // Fallback to embedded Aiven CA cert so it connects with valid SSL anywhere (including Render)
  if (!sslCa) {
    sslCa = DEFAULT_AIVEN_CA
  }

  return {
    host: process.env.AIVEN_MYSQL_HOST || 'mysql-4a1e757-adalavalust.k.aivencloud.com',
    port: Number(process.env.AIVEN_MYSQL_PORT) || 19703,
    user: process.env.AIVEN_MYSQL_USER || 'avnadmin',
    password: process.env.AIVEN_MYSQL_PASSWORD || 'AVNS_yLCRClqcAZFife6krA5',
    database: process.env.AIVEN_MYSQL_DATABASE || 'cmspawsandtails',
    ssl: sslCa ? { ca: sslCa, rejectUnauthorized: true } : { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
}

let pool: mysql.Pool | null = null

export function getAivenPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(getAivenConnectionConfig())
  }
  return pool
}

export async function initAivenTables() {
  const p = getAivenPool()

  // 1. Categories Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(50) DEFAULT '🐾',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  // 2. Products Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      category_name VARCHAR(255) NOT NULL,
      pet_type VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      original_price DECIMAL(10, 2),
      stock INT DEFAULT 20,
      rating DECIMAL(3, 2) DEFAULT 5.0,
      reviews_count INT DEFAULT 12,
      sku VARCHAR(100) NOT NULL,
      image_url VARCHAR(600) NOT NULL,
      excerpt TEXT,
      description LONGTEXT,
      key_benefits LONGTEXT,
      ingredients LONGTEXT,
      usage_guide TEXT,
      weight_size VARCHAR(100),
      brand VARCHAR(100) DEFAULT 'Paws & Tails Choice',
      is_featured BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  // 3. Orders Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(100) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(100) NOT NULL,
      customer_email VARCHAR(255),
      shipping_address TEXT NOT NULL,
      city_province VARCHAR(255) NOT NULL,
      courier VARCHAR(100) DEFAULT 'J&T Express Philippines',
      payment_method VARCHAR(50) NOT NULL,
      payment_reference VARCHAR(100),
      subtotal DECIMAL(10, 2) NOT NULL,
      shipping_fee DECIMAL(10, 2) NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'payment_verifying',
      tracking_number VARCHAR(100),
      items_json LONGTEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  // 4. Reviews Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_slug VARCHAR(255) NOT NULL,
      author_name VARCHAR(255) NOT NULL,
      rating INT NOT NULL,
      comment TEXT NOT NULL,
      pet_name_or_breed VARCHAR(100) DEFAULT 'Beloved Pet',
      helpful_count INT DEFAULT 4,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)
}

export async function insertOrderToAiven(orderData: {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  shippingAddress: string
  cityProvince: string
  courier: string
  paymentMethod: string
  paymentReference?: string
  subtotal: number
  shippingFee: number
  totalAmount: number
  status: string
  trackingNumber: string
  items: any
  notes?: string
}) {
  try {
    const p = getAivenPool()
    await p.query(
      `INSERT INTO orders 
      (order_number, customer_name, customer_phone, customer_email, shipping_address, city_province, courier, payment_method, payment_reference, subtotal, shipping_fee, total_amount, status, tracking_number, items_json, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.orderNumber,
        orderData.customerName,
        orderData.customerPhone,
        orderData.customerEmail || null,
        orderData.shippingAddress,
        orderData.cityProvince,
        orderData.courier,
        orderData.paymentMethod,
        orderData.paymentReference || null,
        orderData.subtotal,
        orderData.shippingFee,
        orderData.totalAmount,
        orderData.status,
        orderData.trackingNumber,
        typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items || []),
        orderData.notes || null,
      ]
    )
  } catch (err) {
    console.error('Error inserting order to Aiven MySQL (cmspawsandtails):', err)
  }
}

export async function insertReviewToAiven(reviewData: {
  productSlug: string
  authorName: string
  rating: number
  comment: string
  petNameOrBreed?: string
}) {
  try {
    const p = getAivenPool()
    await p.query(
      `INSERT INTO reviews (product_slug, author_name, rating, comment, pet_name_or_breed)
       VALUES (?, ?, ?, ?, ?)`,
      [
        reviewData.productSlug,
        reviewData.authorName,
        reviewData.rating,
        reviewData.comment,
        reviewData.petNameOrBreed || 'Beloved Pet',
      ]
    )
  } catch (err) {
    console.error('Error inserting review to Aiven MySQL (cmspawsandtails):', err)
  }
}

export async function getProductsFromAiven() {
  try {
    const p = getAivenPool()
    const [rows] = await p.query(
      `SELECT id, title, slug, category_name as category, pet_type as petType, price, original_price as originalPrice,
              stock, rating, reviews_count as reviewsCount, sku, image_url as imageUrl, excerpt, description,
              key_benefits as keyBenefits, ingredients, usage_guide as usageGuide, weight_size as weightSize,
              brand, is_featured as isFeatured
       FROM products ORDER BY is_featured DESC, id ASC`
    )
    const products = (rows as any[]).map((row: any) => ({
      ...row,
      price: Number(row.price),
      originalPrice: Number(row.originalPrice),
      keyBenefits: (() => {
        try { return JSON.parse(row.keyBenefits || '[]') } catch { return [] }
      })(),
      isFeatured: Boolean(row.isFeatured),
    }))
    return products
  } catch (err) {
    console.error('getProductsFromAiven error:', err)
    return []
  }
}

export async function getOrderFromAiven(query: string) {
  try {
    const p = getAivenPool()
    const term = `%${query}%`
    const [rows] = await p.query(
      `SELECT * FROM orders 
       WHERE order_number LIKE ? 
          OR tracking_number LIKE ? 
          OR customer_phone LIKE ? 
          OR customer_name LIKE ?
       ORDER BY created_at DESC LIMIT 5`,
      [term, term, term, term]
    )
    return rows as any[]
  } catch (err) {
    console.error('getOrderFromAiven error:', err)
    return []
  }
}

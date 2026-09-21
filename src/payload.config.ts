import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Reviews } from './collections/Reviews'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://pawsandtails.onrender.com' : 'http://localhost:3001')

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.RENDER_EXTERNAL_URL || '',
    'https://pawsandtails.onrender.com',
    'https://*.onrender.com',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.RENDER_EXTERNAL_URL || '',
    'https://pawsandtails.onrender.com',
    'https://*.onrender.com',
  ].filter(Boolean),
  collections: [
    Users,
    Categories,
    Products,
    Orders,
    Reviews,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'paws-and-tails-secure-payload-key-2026',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || `file:${path.resolve(dirname, '../pawsandtails.db')}`,
    },
  }),
  sharp,
  plugins: [],
})

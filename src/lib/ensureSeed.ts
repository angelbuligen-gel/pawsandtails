import { getAivenPool, initAivenTables } from './aiven'
import { getPayload } from 'payload'
import config from '@payload-config'

let seedPromise: Promise<void> | null = null
let hasChecked = false

/**
 * Ensures the database is seeded without needing manual `npm run seed`.
 * Runs in the background on first request or server startup.
 * Seeds both Payload CMS (SQLite) and Aiven Cloud MySQL.
 */
export async function ensureDatabaseSeeded() {
  if (hasChecked) return
  if (seedPromise) return seedPromise

  seedPromise = (async () => {
    try {
      // 1. Check & Seed Payload CMS Collections
      try {
        const payload = await getPayload({ config })
        const payloadProducts = await payload.find({
          collection: 'products',
          limit: 1,
        })

        if (!payloadProducts || payloadProducts.totalDocs < 25) {
          console.log(`[AutoSeed] Payload CMS has ${payloadProducts?.totalDocs || 0}/25 products. Auto-seeding Payload...`)
          const { seedPayload } = await import('@/seed/seedPayload')
          await seedPayload()
          console.log('[AutoSeed] ✅ Payload CMS auto-seeding completed!')
        }
      } catch (payloadErr) {
        console.warn('[AutoSeed] Payload check notice:', payloadErr)
      }

      // 2. Check & Seed Aiven MySQL
      try {
        await initAivenTables()
        const pool = getAivenPool()
        const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM products')
        const count = rows?.[0]?.count || 0

        if (count < 25) {
          console.log(`[AutoSeed] Aiven MySQL has ${count}/25 products. Auto-seeding Aiven...`)
          const { seedDatabase } = await import('@/seed/index')
          await seedDatabase()
          console.log('[AutoSeed] ✅ Aiven MySQL auto-seeding completed!')
        }
      } catch (aivenErr) {
        console.warn('[AutoSeed] Aiven MySQL check notice:', aivenErr)
      }

      hasChecked = true
    } finally {
      seedPromise = null
    }
  })()

  return seedPromise
}

import { getAivenPool, initAivenTables } from './aiven'
import { ALL_25_PRODUCTS } from '@/seed/allProductsData'

let seedPromise: Promise<void> | null = null
let hasChecked = false

/**
 * Ensures the database is seeded without needing manual `npm run seed`.
 * Runs in the background on first request or server startup.
 */
export async function ensureDatabaseSeeded() {
  if (hasChecked) return
  if (seedPromise) return seedPromise

  seedPromise = (async () => {
    try {
      await initAivenTables()
      const pool = getAivenPool()

      const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM products')
      const count = rows?.[0]?.count || 0

      if (count < 25) {
        console.log(`[AutoSeed] Aiven MySQL has ${count}/25 products. Seeding now...`)
        const { seedDatabase } = await import('@/seed/index')
        await seedDatabase()
        console.log('[AutoSeed] ✅ Auto-seeding completed successfully!')
      }
      hasChecked = true
    } catch (err) {
      console.warn('[AutoSeed] Auto-seed check notice:', err)
    } finally {
      seedPromise = null
    }
  })()

  return seedPromise
}

import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ca = fs.readFileSync(path.join(__dirname, '../../ca.pem'), 'utf8')

const pool = mysql.createPool({
  host: 'mysql-4a1e757-adalavalust.k.aivencloud.com',
  port: 19703,
  user: 'avnadmin',
  password: 'AVNS_yLCRClqcAZFife6krA5',
  database: 'cmspawsandtails',
  ssl: { ca, rejectUnauthorized: true },
})

const UPDATES = [
  { slug: 'grain-free-salmon-sweet-potato-dog-kibble', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80' },
  { slug: 'ocean-whitefish-tuna-wet-cat-pouch-12x', url: 'https://images.unsplash.com/photo-1611471571826-b3d11e88d49b?auto=format&fit=crop&w=800&q=80' },
  { slug: 'fruitblend-premium-pellets-parrots', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80' },
  { slug: 'micro-pellets-tropical-fish-nutrition', url: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=800&q=80' },
  { slug: 'western-timothy-hay-high-fiber-grass', url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80' },
  { slug: 'reflective-no-pull-dog-harness-breathable', url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'breakaway-safety-velvet-cat-collar-bell', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80' },
  { slug: 'multi-branch-natural-wood-bird-perch', url: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80' },
  { slug: 'submersible-led-aquarium-bubble-wand', url: 'https://images.unsplash.com/photo-1520301255226-bf5f144451c1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'silent-bearing-exercise-wheel-hamster', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80' },
  { slug: 'wild-alaskan-salmon-oil-supplement-250ml', url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80' },
  { slug: 'calci-pet-calcium-vitamin-d3-chews', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { slug: 'hairball-relief-digestive-malt-paste-100g', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80' },
  { slug: 'avian-soluble-multivitamin-feather-drops', url: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80' },
  { slug: 'aquasafe-water-conditioner-dechlorinator', url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80' },
  { slug: 'indestructible-rubber-treat-dispenser-bone', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80' },
  { slug: 'automatic-smart-laser-feather-rotating-cat-ball', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80' },
  { slug: 'foraging-shredder-bell-rattan-chew-cluster', url: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?auto=format&fit=crop&w=800&q=80' },
  { slug: 'ancient-shipwreck-resin-aquarium-hideout', url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80' },
  { slug: 'crinkle-play-tunnel-hideaway-tube-small-pet', url: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=800&q=80' },
  { slug: 'oatmeal-aloe-vera-anti-itch-dog-shampoo-500ml', url: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80' },
  { slug: 'waterless-foaming-dry-bath-cat-shampoo', url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=800&q=80' },
  { slug: 'self-cleaning-slicker-undercoat-brush', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80' },
  { slug: 'dust-free-lavender-bentonite-cat-litter-10l', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'pet-nail-clipper-led-light-safety-guard', url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80' },
]

let ok = 0, fail = 0
for (const { slug, url } of UPDATES) {
  try {
    const [res] = await pool.query('UPDATE products SET image_url = ? WHERE slug = ?', [url, slug])
    const r = res as any
    if (r.affectedRows > 0) { ok++; console.log(`✅ ${slug}`) }
    else { fail++; console.log(`⚠️  NOT FOUND: ${slug}`) }
  } catch (e: any) {
    fail++; console.log(`❌ ${slug}: ${e.message}`)
  }
}
console.log(`\nDone: ${ok} updated, ${fail} failed`)
await pool.end()

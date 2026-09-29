import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'src/components/hub-calculators/everyday'
for (const f of readdirSync(dir)) {
  if (!/\.(ts|tsx)$/.test(f)) continue
  if (!/price|ev-|paint|pet-cost|unit/.test(f)) continue
  const t = readFileSync(join(dir, f), 'utf8')
  const m = t.match(/unit:\s*['"][^'"]*['"]/g)
  if (m) console.log(`${f} -> ${[...new Set(m)].join(' | ')}`)
}

// find unit-price calc slug file via index
const idx = readFileSync(join(dir, 'index.ts'), 'utf8')
for (const line of idx.split('\n')) {
  if (/unit-price|price-oz|price-lb|ev-charging|room-paint|paint-calculator-calc|'pet-cost'/.test(line)) console.log('index: ' + line.trim())
}

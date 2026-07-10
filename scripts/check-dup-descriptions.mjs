// node scripts/check-dup-descriptions.mjs

import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function loadRegistry() {
  const distPath = resolve(__dirname, '..', 'packages', 'calculator-registry', 'dist', 'index.mjs')
  if (!existsSync(distPath)) {
    throw new Error('Cannot find calculator registry. Run: pnpm --filter @calcuniverse/calculator-registry build')
  }
  const fileUrl = new URL(`file:///${distPath.replace(/\\/g, '/')}`).href
  const mod = await import(fileUrl)
  if (mod.calculatorRegistry) return mod.calculatorRegistry
  if (mod.default?.calculatorRegistry) return mod.default.calculatorRegistry
  for (const key of Object.keys(mod)) {
    if (Array.isArray(mod[key]) && mod[key].length > 100) return mod[key]
  }
  throw new Error('No array export found in registry dist')
}

function groupByHub(registry) {
  const groups = {}
  for (const calc of registry) {
    const hub = calc.category || calc.hubSlug || 'unknown'
    if (!groups[hub]) groups[hub] = []
    groups[hub].push(calc)
  }
  return groups
}

async function main() {
  const registry = await loadRegistry()
  const groups = groupByHub(registry)

  let totalDuplicates = 0
  let hubsWithDupes = 0

  for (const [hub, calcs] of Object.entries(groups)) {
    const seen = new Map()
    for (const calc of calcs) {
      const desc = (calc.description || '').trim().toLowerCase()
      if (!desc) continue
      if (seen.has(desc)) {
        seen.get(desc).push(calc.slug)
      } else {
        seen.set(desc, [calc.slug])
      }
    }

    const dupes = [...seen.entries()].filter(([, slugs]) => slugs.length > 1)
    if (dupes.length > 0) {
      hubsWithDupes++
      console.log(`\n=== ${hub} (${calcs.length} calculators) — ${dupes.length} duplicate descriptions ===`)
      for (const [desc, slugs] of dupes) {
        console.log(`  Duplicate: "${desc.substring(0, 80)}..." → [${slugs.join(', ')}]`)
        totalDuplicates += slugs.length - 1
      }
    }
  }

  const totalCalcs = registry.length
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Total calculators: ${totalCalcs}`)
  console.log(`Hubs with duplicates: ${hubsWithDupes}`)
  console.log(`Duplicate description instances: ${totalDuplicates}`)
  console.log(`${'='.repeat(50)}`)

  if (totalDuplicates > 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// (a) sports defs with unit $
{
  const base = 'src/components/hub-calculators/sports'
  let n = 0
  if (statSync(base)) {
    for (const f of readdirSync(base)) {
      const p = join(base, f)
      if (statSync(p).isFile()) {
        const m = readFileSync(p, 'utf8').match(/unit: ['"][^'"]*\$/g)
        if (m) { n += m.length; console.log(`sports/${f}: ${m.join(', ')}`) }
      }
    }
  }
  console.log(`sports money units: ${n}`)
}

// (b) everyday defs whose slug hits interpretation branches 792/801/824 — show branch conditions
{
  const t = readFileSync('src/components/hub-calculators/GenericEverydayCalculator.tsx', 'utf8').split('\n')
  console.log('\n--- everyday interpretation branch conditions (money-risky) ---')
  for (let i = 785; i <= 830; i++) {
    const l = t[i - 1]
    if (l && (/if \(slug|return/.test(l))) console.log(`${i}: ${l.trim().slice(0, 165)}`)
  }
}

// (c) who imports everyday-data
console.log('\n--- imports of everyday-data ---')
{
  const { execSync } = await import('node:child_process')
  try {
    const out = execSync('git grep -l "everyday-data" -- src', { encoding: 'utf8' })
    console.log(out.trim())
  } catch { console.log('(none)') }
}

// (d) does everyday-data.tsx have "use client"?
console.log('everyday-data first line: ' + readFileSync('src/components/hub-calculators/everyday-data.tsx', 'utf8').split('\n')[0])

// Targeted checks for remaining money-unit render paths.
import { readFileSync } from 'node:fs'

// (a) math / engineering compute defs emitting unit: '$'
for (const dir of ['math', 'engineering']) {
  const { readdirSync, statSync } = await import('node:fs')
  const { join } = await import('node:path')
  const base = `src/components/hub-calculators/${dir}`
  let hits = 0
  const files = []
  try {
    for (const f of readdirSync(base)) {
      const p = join(base, f)
      if (statSync(p).isFile() && /\.tsx?$/.test(f)) files.push(p)
    }
  } catch { /* no dir */ }
  for (const p of files) {
    const t = readFileSync(p, 'utf8')
    const m = t.match(/unit: ['"]\$['"]/g)
    if (m) { hits += m.length; console.log(`${dir}/${p.split(/[\\/]/).pop()}: ${m.length} unit:$`) }
  }
  console.log(`${dir}: total unit:$ = ${hits}`)
}

// (b) food interpretation: any branch whose slug match is cost/money-related AND renders {u}
{
  const t = readFileSync('src/components/hub-calculators/GenericFoodCalculator.tsx', 'utf8').split('\n')
  console.log('\n--- food interpretation branches containing {u} ---')
  t.forEach((l, i) => {
    if (i > 300 && i < 400 && /\{u\}/.test(l)) console.log(`${i + 1}: ${l.trim().slice(0, 150)}`)
  })
}

// (c) what `lines` is in GenericFood:293 and GenericSports:303
for (const [f, anchor] of [
  ['src/components/hub-calculators/GenericFoodCalculator.tsx', 293],
  ['src/components/hub-calculators/GenericSportsCalculator.tsx', 303],
]) {
  const t = readFileSync(f, 'utf8').split('\n')
  console.log(`\n--- ${f} context around ${anchor} ---`)
  for (let n = anchor - 25; n <= anchor + 8; n++) if (t[n - 1] !== undefined) console.log(`${n}: ${t[n - 1].trim().slice(0, 150)}`)
}

// (d) math compute steps with $ literals
{
  const { readdirSync, statSync } = await import('node:fs')
  const { join } = await import('node:path')
  const base = 'src/components/hub-calculators/math'
  let moneySteps = 0
  for (const f of readdirSync(base)) {
    const p = join(base, f)
    if (!statSync(p).isFile()) continue
    const t = readFileSync(p, 'utf8')
    const m = t.match(/\$[0-9]/g)
    if (m) { moneySteps += m.length; console.log(`math/${f}: ${m.length} $digits`) }
  }
  console.log(`math total $digits: ${moneySteps}`)
}

// Scan premium/ (and other non-codemod-scoped display dirs) for money displays
// that don't go through subMoney/useCurrency.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

function walk(d, out = []) {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(f)) out.push(p)
  }
  return out
}

const roots = process.argv.slice(2)
if (roots.length === 0) roots.push('src/components/premium')

for (const root of roots) {
  for (const f of walk(root)) {
    const lines = readFileSync(f, 'utf8').split('\n')
    lines.forEach((l, i) => {
      // money-looking literal: $ followed by digit in any string context
      if (/\$[0-9]/.test(l) && !/className|https?:/.test(l)) {
        console.log(`${basename(f)}:${i + 1}: ${l.trim().slice(0, 150)}`)
      }
    })
  }
}

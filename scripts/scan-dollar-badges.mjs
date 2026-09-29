// Exact inventory of hardcoded $ currency-prefix badges in JSX.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

function walk(d, out = []) {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(f)) out.push(p)
  }
  return out
}

let total = 0
for (const f of walk('src')) {
  const lines = readFileSync(f, 'utf8').split('\n')
  lines.forEach((l, i) => {
    // JSX text node that is exactly $
    if (/>\s*\$\s*</.test(l)) {
      total++
      console.log(`${relative('.', f).replace(/\\/g, '/')}:${i + 1}: ${l.trim().slice(0, 130)}`)
    }
  })
}
console.log(`total >$< badge lines: ${total}`)

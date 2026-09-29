// Add missing `currency` / `currencySymbol` deps to useMemo/useCallback calls
// whose bodies reference them (stale-closure fix after codemod R1/R4/R5).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    if (['node_modules', '.next', 'dist', '.git'].includes(f)) continue
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(f)) out.push(p)
  }
  return out
}

let fixed = 0
const report = []

for (const abs of walk(join(ROOT, 'src'))) {
  const text = readFileSync(abs, 'utf8')
  if (!text.includes('useMemo') && !text.includes('useCallback')) continue
  const rel = abs.replace(/\\/g, '/')
  const edits = [] // {start, end, replacement} — applied descending
  const re = /\b(useMemo|useCallback)\s*\(/g
  let m
  while ((m = re.exec(text)) !== null) {
    // find matching close paren of the hook call
    let i = m.index + m[0].length
    let depth = 1
    while (i < text.length && depth > 0) {
      const c = text[i]
      if (c === '(') depth++
      else if (c === ')') depth--
      i++
    }
    const callStart = m.index
    const callEnd = i // exclusive, after ')'
    const call = text.slice(callStart, callEnd)
    const usesSym = /\bcurrencySymbol\b/.test(call)
    const usesCur = /(?<![\w.])currency(?![\w:])/.test(call)
    if (!usesSym && !usesCur) continue
    // locate dep array: last '[' ... ']' where ']' is followed by ')' at call end
    const tail = call.replace(/\s*$/, '')
    const depMatch = /\[\s*([^\]]*)\]\s*\)$/.exec(tail)
    if (!depMatch) continue
    const deps = depMatch[1]
    const missing = []
    if (usesSym && !/\bcurrencySymbol\b/.test(deps)) missing.push('currencySymbol')
    if (usesCur && !/(?<![\w.])currency(?![\w:])/.test(deps)) missing.push('currency')
    if (!missing.length) continue
    // absolute position of the closing ']' of the dep array
    const tailOffsetInCall = call.lastIndexOf(']')
    const absCloseBracket = callStart + tailOffsetInCall
    const currentDepText = deps.trim()
    const addition = (currentDepText ? ', ' : '') + missing.join(', ')
    edits.push({ start: absCloseBracket, end: absCloseBracket, replacement: addition, marker: missing.join('+') })
  }
  if (!edits.length) continue
  // apply descending
  edits.sort((a, b) => b.start - a.start)
  let out = text
  for (const e of edits) out = out.slice(0, e.start) + e.replacement + out.slice(e.end)
  writeFileSync(abs, out)
  fixed += edits.length
  report.push(`${rel}: +${edits.length}`)
}

console.log(`dep arrays fixed: ${fixed}`)
for (const r of report) console.log('  ' + r)

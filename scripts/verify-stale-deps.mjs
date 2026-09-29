// Find useMemo/useCallback bodies that reference `currency` or `currencySymbol`
// but omit them from the dependency array (stale closure after currency change).
import { readFileSync, readdirSync, statSync } from 'node:fs'
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

const hits = []
for (const abs of walk(join(ROOT, 'src'))) {
  const rel = abs.replace(/\\/g, '/')
  const text = readFileSync(abs, 'utf8')
  // locate each useMemo( / useCallback( call, capture body + deps array
  const re = /\b(useMemo|useCallback)\s*\(/g
  let m
  while ((m = re.exec(text)) !== null) {
    // find matching paren for the call
    let i = m.index + m[0].length
    let depth = 1
    while (i < text.length && depth > 0) {
      const c = text[i]
      if (c === '(') depth++
      else if (c === ')') depth--
      i++
    }
    const call = text.slice(m.index, i)
    const usesCur = /\bcurrencySymbol\b|\bcurrency\b/.test(call)
    if (!usesCur) continue
    // deps array = last [...] before closing paren of the call
    const depMatch = /\[\s*([^\]]*)\]\s*\)$/.exec(call.trim())
    if (!depMatch) continue
    const deps = depMatch[1]
    const missing = []
    if (/\bcurrencySymbol\b/.test(call) && !/\bcurrencySymbol\b/.test(deps)) missing.push('currencySymbol')
    if (/(?<![\w.])currency(?![\w:])/.test(call) && !/(?<![\w.])currency(?![\w:])/.test(deps)) missing.push('currency')
    if (missing.length) {
      const line = text.slice(0, m.index).split('\n').length
      hits.push({ rel, line, kind: m[1], missing: missing.join(', '), snippet: call.split('\n')[0].slice(0, 100) })
    }
  }
}
if (!hits.length) { console.log('OK — no useMemo/useCallback missing currency deps'); process.exit(0) }
console.log(`STALE DEPS (${hits.length}):`)
for (const h of hits) console.log(`  ${h.rel}:${h.line}  ${h.kind}  missing: ${h.missing}`)
process.exit(1)

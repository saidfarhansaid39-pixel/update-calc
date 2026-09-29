// Repair codemod INSERT off-by-one — pass 3 (handles LF + CRLF correctly).
//
// The codemod inserted the hook line AT the `{` of the function body, so the
// brace ended up glued to the hook line:
//     export function Foo()
//       const { currencySymbol } = useCurrency(){
// Pass 2 moved the brace back to the signature line but, for CRLF files, only
// stripped the \r instead of the { — leaving BOTH a correct brace on the
// signature line and a stray one on the hook line. This pass:
//   - hook line ends with `){` and prev line ends with `{` → drop stray `{`
//   - hook line ends with `){` and prev line does NOT        → move `{` up
// and normalizes line endings of touched CRLF files.
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

const HOOK_BRACE = /^([ \t]*)const \{ ([^}]+) \} = useCurrency\(\)\{(\r?)$/
const HOOK_OK = /^[ \t]*const \{ [^}]+ \} = useCurrency\(\)\r?$/

let filesTouched = 0
let dropped = 0
let moved = 0
const leftovers = []
const anomalies = []

for (const abs of walk(join(ROOT, 'src'))) {
  const original = readFileSync(abs, 'utf8')
  if (!original.includes('= useCurrency()')) continue
  const rel = abs.replace(/\\/g, '/')
  const isCRLF = original.includes('\r\n')
  const lines = original.split('\n')
  let touched = false

  for (let i = 1; i < lines.length; i++) {
    const m = HOOK_BRACE.exec(lines[i])
    if (!m) continue
    const [, indent, names] = m
    const cleanHook = `${indent}const { ${names} } = useCurrency()`
    const prevRaw = lines[i - 1]
    const prevCR = prevRaw.endsWith('\r')
    const prevBody = prevCR ? prevRaw.slice(0, -1) : prevRaw

    if (prevBody.endsWith('{')) {
      // brace already restored on the signature line — drop the stray one
      lines[i] = cleanHook + (isCRLF ? '\r' : '')
      dropped++
    } else {
      // move the brace up to the signature line
      lines[i - 1] = prevBody + '{' + (isCRLF ? '\r' : '')
      lines[i] = cleanHook + (isCRLF ? '\r' : '')
      moved++
    }
    // signature line may have lost its \r in the buggy pass 2 — restore
    if (isCRLF && !lines[i - 1].endsWith('\r')) lines[i - 1] += '\r'
    touched = true
  }

  if (touched) {
    let out = lines.join('\n')
    if (isCRLF) out = out.replace(/\r?\n/g, '\r\n')
    writeFileSync(abs, out)
    filesTouched++
  }
}

// --- verification pass ---
for (const abs of walk(join(ROOT, 'src'))) {
  const text = readFileSync(abs, 'utf8')
  if (!text.includes('= useCurrency()')) continue
  const rel = abs.replace(/\\/g, '/')
  const lines = text.split('\n')
  lines.forEach((ln, i) => {
    if (/= useCurrency\(\)\{/.test(ln)) leftovers.push(`${rel}:${i + 1} stray brace: ${ln.trim().slice(0, 90)}`)
    if (!HOOK_OK.test(ln)) return
    if (i === 0) { anomalies.push(`${rel}:${i + 1} hook at file start`); return }
    const prev = lines[i - 1].replace(/\r$/, '')
    if (!prev.endsWith('{')) {
      anomalies.push(`${rel}:${i + 1} mid-body hook (verify unconditional) :: ${prev.slice(-80)}`)
    }
  })
}

console.log(`files touched: ${filesTouched}   braces dropped: ${dropped}   braces moved up: ${moved}`)
console.log(`stray braces remaining: ${leftovers.length}`)
for (const l of leftovers) console.log('  ' + l)
console.log(`mid-body hooks (expected: pre-existing Phase-1 / unconditional): ${anomalies.length}`)
for (const a of anomalies) console.log('  ' + a)
process.exit(leftovers.length ? 1 : 0)

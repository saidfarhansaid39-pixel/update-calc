// Parse every changed file; report first parse errors with real line numbers.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const only = process.argv[2] // optional single file
const diff = only ? [only] : execSync('git diff --name-only -- src', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  .split('\n').map(s => s.trim()).filter(Boolean)

let bad = 0
for (const f of diff) {
  let text
  try { text = readFileSync(f, 'utf8') } catch { continue }
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true,
    f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const diags = sf.parseDiagnostics || []
  if (diags.length) {
    bad++
    console.log(`\n=== ${f}  (${diags.length} parse errors)`)
    for (const d of diags.slice(0, 5)) {
      const start = typeof d.start === 'number' ? d.start : (typeof d.pos === 'number' ? d.pos : 0)
      const p = Math.min(Math.max(0, start), text.length)
      const before = text.slice(0, p)
      const line = before.split('\n').length
      const col = p - before.lastIndexOf('\n')
      const src = text.slice(p, p + 60).replace(/\n/g, '\\n')
      console.log(`  ${line}:${col}  ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}   >> ${src}`)
    }
  }
}
console.log(bad ? `\n${bad}/${diff.length} files have parse errors` : `all ${diff.length} files parse clean`)
process.exit(bad ? 1 : 0)

// Find JSX expressions referencing .unit / .value that are NOT wrapped in subMoney.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'

function walk(d, out = []) {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(f)) out.push(p)
  }
  return out
}

const files = walk('src/components')
let hits = 0
for (const f of files) {
  const rel = relative('.', f).replace(/\\/g, '/')
  if (/Article\.tsx$/.test(rel) || /Currency(Tables|Form|Calculator)\.tsx$/.test(rel)) continue
  const text = readFileSync(f, 'utf8')
  let sf
  try {
    sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  } catch {
    continue
  }
  const visit = (node) => {
    if (ts.isJsxExpression(node) && node.expression) {
      const expr = node.expression
      const src = expr.getText(sf)
      if (/\.(unit|value)\b/.test(src) && !src.includes('subMoney') && !/fmtUnit|formatCurrency|formatWithExtras/.test(src)) {
        // only report if an ident carries .unit/.value (any ident, not just R4 set)
        if (/[A-Za-z_$][\w$]*\.(unit|value)\b/.test(src)) {
          hits++
          const { line } = sf.getLineAndCharacterOfPosition(expr.getStart(sf))
          console.log(`${rel}:${line + 1}: {${src.slice(0, 120)}}`)
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}
console.log(`\nunwrapped .unit/.value JSX expressions: ${hits}`)

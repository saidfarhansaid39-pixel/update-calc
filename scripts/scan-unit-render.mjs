// For every Generic* renderer + everyday-data + math/engineering specials:
// find JSX expressions rendering `.unit` or `.steps.map` bodies, report whether
// subMoney/currencySymbol wraps them, and identify the receiver ident.
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

const targets = walk('src/components').filter(f =>
  /Generic\w+\.tsx$|everyday-data\.tsx$/.test(f)
)
console.log(`files: ${targets.length}`)

for (const f of targets) {
  const rel = relative('.', f).replace(/\\/g, '/')
  const text = readFileSync(f, 'utf8')
  let sf
  try {
    sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  } catch { continue }

  const visit = (node) => {
    if (ts.isJsxExpression(node) && node.expression) {
      const src = node.expression.getText(sf)
      const wrapped = src.includes('subMoney') || src.includes('currencySymbol') || src.includes('fmtUnit')
      // .unit render anywhere in the expression
      if (/[A-Za-z_$][\w$]*\.unit\b/.test(src) && !wrapped) {
        const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf))
        console.log(`UNIT-RAW ${rel}:${line + 1}: {${src.slice(0, 130)}}`)
      }
    }
    // .map(...) whose body renders .value and isn't wrapped
    if (ts.isJsxExpression(node) && node.expression && ts.isCallExpression(node.expression)) {
      const call = node.expression
      if (ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === 'map') {
        const src = call.getText(sf)
        if (/\.(value|steps)\b/.test(src) && !src.includes('subMoney') && !src.includes('fmtUnit')) {
          const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf))
          console.log(`MAP-RAW ${rel}:${line + 1}: ${src.slice(0, 130).replace(/\s+/g, ' ')}`)
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}
console.log('done')

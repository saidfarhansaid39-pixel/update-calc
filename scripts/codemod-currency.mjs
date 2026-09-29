#!/usr/bin/env node
/**
 * codemod-currency.mjs — make money displays follow the visitor's selected
 * currency (RegionProvider/CurrencyContext) instead of hardcoded USD.
 *
 * Rules:
 *  R1  formatCurrency(x, 'USD', locale)   → formatCurrency(x, currency, locale)
 *      + `const { currency } = useCurrency()` inserted into enclosing component.
 *  R2  <Comp currencySymbol="$" />        → attribute removed (component falls
 *      back to the context symbol).
 *  R3  useCurrencyFormat('USD')           → useCurrencyFormat()  (context fallback).
 *  R4  {res.unit} / {s.value} …           → {subMoney(res.unit, currencySymbol)}
 *      (compute data carries literal `$` that isn't visible in source).
 *  R5  literal `$` inside JSX text and template-literal text chunks
 *      → `{currencySymbol}` / `${currencySymbol}`.
 *
 * Usage:  node scripts/codemod-currency.mjs          # dry-run report
 *         node scripts/codemod-currency.mjs --apply  # write files
 */
import ts from 'typescript'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const APPLY = process.argv.includes('--apply')
const CTX_MODULE = '@/lib/context/CurrencyContext'

// ---------------------------------------------------------------- file discovery
function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', '.next', 'dist', '.git', 'out'].includes(f)) continue
    const p = path.join(dir, f)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(f)) out.push(p)
  }
  return out
}
const allFiles = walk(path.join(ROOT, 'src'))

// R4: JSX expressions whose identifier is one of these (data carrying `$`).
const R4_IDENTS = new Set(['res', 'resultData', 'step', 's'])
const R4_PROPS = new Set(['unit', 'value'])
// R5 scope: functional UI text (not prose sections / content / data files).
// Excluded on purpose:
//  - *Article.tsx           — English editorial prose with US-law amounts
//                             (e.g. "minimum wage is $7.25") must stay USD.
//  - Currency*Calculator/Form/Tables — converter UI showing explicit
//                             multi-currency pairs, not a display preference.
//  - GenericConversionCalculator — its `unit: '$'` (eur-to-usd, gbp-to-usd)
//                             is the TARGET currency of the FX pair, which must
//                             stay '$' regardless of the display preference.
const R5_SCOPE = (rel) =>
  (/^src[\\/]components[\\/]hub-calculators[\\/]Generic[^\\/]*\.tsx$/.test(rel) ||
    /^src[\\/]components[\\/]calculator[\\/][^\\/]*\.tsx$/.test(rel) ||
    /^src[\\/]components[\\/]calc-panel[\\/][^\\/]*\.tsx$/.test(rel)) &&
  !/Article\.tsx$/.test(rel) &&
  !/calculator[\\/]Currency(Tables|Form|Calculator)\.tsx$/.test(rel) &&
  !/hub-calculators[\\/]GenericConversionCalculator\.tsx$/.test(rel)

const relOf = (p) => path.relative(ROOT, p).replace(/\\/g, '/')
const isPascal = (n) => typeof n === 'string' && /^[A-Z]/.test(n)

// ---------------------------------------------------------------- per-file state
const reports = [] // {file, rule, line, context}
const globalNotes = []
let editCount = 0

function report(file, rule, sf, pos, ctx) {
  reports.push({ file: relOf(file), rule, line: sf.getLineAndCharacterOfPosition(pos).line + 1, context: ctx.replace(/\s+/g, ' ').slice(0, 160) })
}

function functionName(node) {
  if (ts.isFunctionDeclaration(node) && node.name) return node.name.text
  if (ts.isVariableDeclaration(node.parent) && node.parent.name && ts.isIdentifier(node.parent.name)) return node.parent.name.text
  if (ts.isPropertyAssignment(node.parent) && ts.isIdentifier(node.parent.name)) return node.parent.name.text
  return null
}
const isFunctionNode = (n) => ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n)
function hasBlockBody(n) { return !!n.body && ts.isBlock(n.body) }

function containsJsx(node) {
  let found = false
  const visit = (n) => {
    if (found) return
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) { found = true; return }
    ts.forEachChild(n, visit)
  }
  visit(node)
  return found
}
function containsIdent(node, names) {
  let found = false
  const visit = (n) => {
    if (found) return
    if (ts.isIdentifier(n) && names.has(n.text)) { found = true; return }
    ts.forEachChild(n, visit)
  }
  visit(node)
  return found
}

function processFile(file) {
  const text = fs.readFileSync(file, 'utf8')
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind)

  const edits = [] // {start,end,replacement,rule}
  const nameTargets = new Map() // function node -> Set(names)
  const wrapTargets = new Map() // function node -> true (needs subMoney import)
  let needsUseCurrencyImport = false
  let needsSubMoneyImport = false
  const rel = relOf(file)
  const inR5Scope = R5_SCOPE(rel)

  const addEdit = (start, end, replacement, rule) => {
    edits.push({ start, end, replacement, rule })
    editCount++
  }

  // Enclosing component (PascalCase, block body) for hook insertion.
  function pickTarget(stack) {
    for (let i = stack.length - 1; i >= 0; i--) {
      const fn = stack[i]
      if (isPascal(functionName(fn)) && hasBlockBody(fn)) return fn
    }
    return null
  }
  function bodyConflicts(fn, names) {
    const bodyText = text.slice(fn.body.getStart(sf), fn.body.getEnd())
    if (/useCurrency\s*\(/.test(bodyText)) return 'already calls useCurrency()'
    for (const n of names) {
      const re = new RegExp(`\\b(const|let|var)\\s+${n}\\b|\\b${n}\\s*:`)
      if (re.test(bodyText)) return `declares ${n}`
    }
    return null
  }
  function needsName(stack, name) {
    const fn = pickTarget(stack)
    if (!fn) return false
    if (bodyConflicts(fn, [name])) return false
    if (!nameTargets.has(fn)) nameTargets.set(fn, new Set())
    nameTargets.get(fn).add(name)
    needsUseCurrencyImport = true
    return true
  }

  // -------------------------------------------------------------- traversal
  const fnStack = []
  const jsxTagStack = []

  function visit(node) {
    const fn = isFunctionNode(node)
    if (fn) fnStack.push(node)

    // ---- R1: formatCurrency(x, 'USD', ...)
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'formatCurrency' &&
      node.arguments.length >= 2 &&
      ts.isStringLiteral(node.arguments[1]) &&
      node.arguments[1].text === 'USD'
    ) {
      const target = pickTarget(fnStack)
      const conflict = target ? bodyConflicts(target, ['currency']) : 'no enclosing component'
      if (target && !conflict) {
        const a = node.arguments[1]
        addEdit(a.getStart(sf), a.getEnd(), 'currency', 'R1')
        nameTargets.get(target) ? nameTargets.get(target).add('currency') : nameTargets.set(target, new Set(['currency']))
        needsUseCurrencyImport = true
      } else {
        report(file, 'R1-SKIP', sf, node.getStart(sf), `${conflict || 'skip'} :: ${text.slice(node.getStart(sf), node.getEnd()).slice(0, 120)}`)
      }
      // note: still traverse args below
    }

    // ---- R3: useCurrencyFormat('USD')
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'useCurrencyFormat' &&
      node.arguments.length >= 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text === 'USD'
    ) {
      const a0 = node.arguments[0]
      if (node.arguments.length === 1) addEdit(a0.getStart(sf), a0.getEnd(), '', 'R3')
      else addEdit(a0.getStart(sf), node.arguments[1].getStart(sf), '', 'R3')
    }

    // ---- R2: currencySymbol="$"
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'currencySymbol' && node.initializer) {
      const init = node.initializer
      const isDollar =
        (ts.isStringLiteral(init) && init.text === '$') ||
        (ts.isJsxExpression(init) && init.expression && ts.isStringLiteral(init.expression) && init.expression.text === '$')
      if (isDollar) {
        const start = node.getStart(sf)
        const end = node.getEnd()
        const lineStart = text.lastIndexOf('\n', start - 1) + 1
        const lineEnd = text.indexOf('\n', end)
        const lineEndAbs = lineEnd === -1 ? text.length : lineEnd + 1
        const before = text.slice(lineStart, start)
        const after = text.slice(end, lineEnd === -1 ? text.length : lineEnd)
        if (/^[ \t]*$/.test(before) && /^[ \t]*$/.test(after)) {
          addEdit(lineStart, lineEndAbs, '', 'R2') // whole line
        } else {
          const wsStart = start - (before.match(/[ \t]*$/) || [''])[0].length
          addEdit(wsStart, end, '', 'R2')
        }
        continueVisit(node)
        if (fn) fnStack.pop()
        return
      }
    }

    // ---- R4: {res.unit} etc.
    if (ts.isJsxExpression(node) && node.expression && inR5Scope) {
      const expr = node.expression
      const bare = ts.isPropertyAccessExpression(expr) && R4_IDENTS.has(expr.expression.getText(sf)) && R4_PROPS.has(expr.name.text)
      const wrapped =
        !bare &&
        (ts.isConditionalExpression(expr) || ts.isTemplateExpression(expr) || ts.isBinaryExpression(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) &&
        !containsJsx(expr) &&
        containsIdent(expr, new Set(['res', 'resultData', 'step', 's'])) &&
        (expr.getText(sf).includes('.unit') || expr.getText(sf).includes('.value'))
      if (bare || wrapped) {
        const target = pickTarget(fnStack)
        const conflict = target ? bodyConflicts(target, ['currencySymbol']) : 'no enclosing component'
        if (target && !conflict) {
          const start = expr.getStart(sf)
          const end = expr.getEnd()
          addEdit(start, start, 'subMoney(', 'R4')
          addEdit(end, end, ', currencySymbol)', 'R4')
          if (!nameTargets.has(target)) nameTargets.set(target, new Set())
          nameTargets.get(target).add('currencySymbol')
          needsUseCurrencyImport = true
          needsSubMoneyImport = true
        } else {
          report(file, 'R4-SKIP', sf, start, `${conflict || 'skip'} :: ${expr.getText(sf).slice(0, 120)}`)
        }
      }
    }

    // ---- R5: literal $ in JSX text
    if (ts.isJsxText(node) && inR5Scope) {
      const start = node.getStart(sf)
      const end = node.getEnd()
      // skip <code>/<pre>/<script> content
      let inCode = false
      for (const tag of jsxTagStack) if (['code', 'pre', 'script', 'style'].includes(tag)) inCode = true
      if (!inCode) {
        const target = pickTarget(fnStack)
        for (let i = start; i < end; i++) {
          if (text[i] !== '$') continue
          if (!target) { report(file, 'R5-SKIP', sf, i, 'no enclosing component :: ' + text.slice(start, end).slice(0, 80)); continue }
          if (!nameTargets.has(target)) nameTargets.set(target, new Set())
          nameTargets.get(target).add('currencySymbol')
          needsUseCurrencyImport = true
          addEdit(i, i + 1, '{currencySymbol}', 'R5-jsx')
        }
      }
    }

    // ---- R5: literal $ in template-literal text chunks
    if ((ts.isTemplateExpression(node) || ts.isNoSubstitutionTemplateLiteral(node)) && inR5Scope) {
      const target = pickTarget(fnStack)
      const nodeStart = node.getStart(sf)
      const nodeEnd = node.getEnd()
      // raw range excluding surrounding backticks
      let i = nodeStart + 1
      const stop = nodeEnd - 1
      let inText = true
      let depth = 0
      while (i < stop) {
        const ch = text[i]
        if (inText) {
          if (ch === '$' && text[i + 1] === '{') { inText = false; depth = 0; i += 2; continue }
          if (ch === '$') {
            const prev = i > 0 ? text[i - 1] : ''
            const next = i + 1 < stop ? text[i + 1] : ''
            if (prev !== '\\' && prev !== '^' && next !== '^') {
              if (!target) report(file, 'R5-SKIP', sf, i, 'no enclosing component :: ' + text.slice(nodeStart, nodeEnd).slice(0, 80))
              else {
                if (!nameTargets.has(target)) nameTargets.set(target, new Set())
                nameTargets.get(target).add('currencySymbol')
                needsUseCurrencyImport = true
                addEdit(i, i + 1, '${currencySymbol}', 'R5-tpl')
              }
            } else {
              report(file, 'R5-SKIP', sf, i, `guarded $ near '${prev}$${next}' :: ` + text.slice(Math.max(nodeStart, i - 30), i + 30).replace(/\s+/g, ' '))
            }
          }
          i++
        } else {
          if (ch === '{') depth++
          else if (ch === '}') { depth--; if (depth <= 0) { inText = true } }
          i++
        }
      }
    }

    // track jsx tags for code/pre guards
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = node.tagName.getText(sf).replace(/.*\./, '')
      jsxTagStack.push(name)
      continueVisit(node)
      jsxTagStack.pop()
      if (fn) fnStack.pop()
      return
    }

    continueVisit(node)
    if (fn) fnStack.pop()
  }
  function continueVisit(node) { ts.forEachChild(node, visit) }

  // root
  ts.forEachChild(sf, visit)

  // -------------------------------------------------- hook insertion edits
  for (const [fn, names] of nameTargets) {
    const body = fn.body
    const conflict = bodyConflicts(fn, [...names])
    if (conflict) {
      report(file, 'INSERT-SKIP', sf, fn.getStart(sf), `${functionName(fn)}: ${conflict}`)
      // Remove the edits that depend on this insertion would be complex;
      // instead we still apply them but flag loudly — conflicts are rare and
      // caught by typecheck (undefined identifier) if they slip through.
    }
    // NB: body.getStart(sf) is the index OF the `{` token — inserting there
    // swallows the brace onto the hook line (`... = useCurrency(){`). Insert
    // immediately AFTER the `{` instead.
    const bodyStart = body.getStart(sf)
    const insertAt = text[bodyStart] === '{' ? bodyStart + 1 : bodyStart
    const fnLineStart = text.lastIndexOf('\n', fn.getStart(sf) - 1) + 1
    const indent = (text.slice(fnLineStart, fn.getStart(sf)).match(/^[ \t]*/) || [''])[0] + '  '
    const insertText = `\n${indent}const { ${[...names].join(', ')} } = useCurrency()`
    edits.push({ start: insertAt, end: insertAt, replacement: insertText, rule: 'INSERT' })
    editCount++
  }

  // ------------------------------------------------------- import edits
  if ((needsUseCurrencyImport || needsSubMoneyImport) && edits.length) {
    const wanted = []
    if (needsUseCurrencyImport) wanted.push('useCurrency')
    if (needsSubMoneyImport) wanted.push('subMoney')
    const existing = sf.statements.find(
      (s) => ts.isImportDeclaration(s) && ts.isStringLiteral(s.moduleSpecifier) && s.moduleSpecifier.text === CTX_MODULE
    )
    if (existing && ts.isNamedImports(existing.importClause.namedBindings)) {
      const els = existing.importClause.namedBindings.elements
      const have = new Set(els.map((e) => (e.propertyName || e.name).text))
      const missing = wanted.filter((w) => !have.has(w))
      if (missing.length) {
        const last = els[els.length - 1]
        edits.push({ start: last.getEnd(), end: last.getEnd(), replacement: ', ' + missing.join(', '), rule: 'IMPORT' })
        editCount++
      }
    } else {
      const imports = sf.statements.filter((s) => ts.isImportDeclaration(s))
      const pos = imports.length ? imports[imports.length - 1].getEnd() : 0
      edits.push({ start: pos, end: pos, replacement: `\nimport { ${wanted.join(', ')} } from '${CTX_MODULE}'`, rule: 'IMPORT' })
      editCount++
    }
  }

  // ------------------------------------------------------- apply
  if (!edits.length) return
  // dedupe exact same-range edits (defensive)
  const seen = new Set()
  const unique = edits.filter((e) => {
    const k = `${e.start}:${e.end}:${e.rule}:${e.replacement}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  unique.sort((a, b) => b.start - a.start || b.end - a.end)
  // overlap check
  let out = text
  let prevStart = Infinity
  for (const e of unique) {
    if (e.end > prevStart && e.start !== e.end) {
      globalNotes.push(`OVERLAP in ${rel}: ${e.rule} @${e.start}`)
      continue
    }
    if (e.start !== e.end) prevStart = e.start
    out = out.slice(0, e.start) + e.replacement + out.slice(e.end)
  }
  if (APPLY) fs.writeFileSync(file, out, 'utf8')
  const byRule = {}
  for (const e of unique) byRule[e.rule] = (byRule[e.rule] || 0) + 1
  globalNotes.push(`${APPLY ? 'WROTE' : 'DRY'} ${rel}: ${JSON.stringify(byRule)}`)
}

// ---------------------------------------------------------------- run
for (const f of allFiles) {
  const text = fs.readFileSync(f, 'utf8')
  if (!/formatCurrency\s*\(|currencySymbol\s*=\s*["']\$["']|useCurrencyFormat\s*\(\s*["']USD["']|\$/.test(text)) continue
  // quick pre-filter: only files that can match something
  if (!/formatCurrency\s*\(|currencySymbol\s*=\s*["']\$["']|useCurrencyFormat\s*\(\s*["']USD["']/.test(text) && !R5_SCOPE(relOf(f))) continue
  processFile(f)
}

console.log(`\n=== currency codemod ${APPLY ? '(APPLY)' : '(DRY RUN)'} — ${editCount} edits ===\n`)
for (const n of globalNotes) console.log('  ' + n)
const skipped = reports.filter((r) => r.rule.endsWith('SKIP'))
const skipsByRule = {}
for (const r of skipped) (skipsByRule[r.rule] ||= []).push(r)
console.log('\n--- SKIPS / NEEDS MANUAL REVIEW ---')
for (const [rule, arr] of Object.entries(skipsByRule)) {
  console.log(`\n${rule}: ${arr.length}`)
  for (const r of arr) console.log(`  ${r.file}:${r.line}  ${r.context}`)
}
if (!skipped.length) console.log('  (none)')

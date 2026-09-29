// Post-codemod safety checks:
//  1. Every function that got `const { ... } = useCurrency()` inserted must be
//     rendered as JSX somewhere (<Name ...>) — calling a hook-using function as
//     a plain function corrupts hook order at runtime.
//  2. Report inserted functions with NO JSX usage anywhere in src/.
import { execSync } from 'node:child_process'
import fs from 'node:path'

const ROOT = process.cwd()
const diff = execSync('git diff -U0 -- src', { cwd: ROOT, maxBuffer: 64 * 1024 * 1024, encoding: 'utf8' })

// Map file -> inserted names
const fileNames = new Map()
let currentFile = null
let lastLine = null
for (const line of diff.split('\n')) {
  const m = /^diff --git a\/(.+?) b\/(.+)$/.exec(line)
  if (m) { currentFile = m[2]; continue }
  const h = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(line)
  if (h) { lastLine = parseInt(h[1], 10); continue }
  if (currentFile && line.startsWith('+') && !line.startsWith('+++')) {
    const nm = /const \{([^}]+)\} = useCurrency\(\)/.exec(line)
    if (nm) {
      const names = nm[1].split(',').map(s => s.trim()).filter(Boolean)
      if (!fileNames.has(currentFile)) fileNames.set(currentFile, new Set())
      for (const n of names) fileNames.get(currentFile).add(n)
    }
    lastLine = lastLine === null ? null : lastLine + 1
  } else if (line.startsWith(' ') && currentFile) {
    lastLine = lastLine === null ? null : lastLine + 1
  }
}

// Extract enclosing function name for each inserted line by reading the file.
function enclosingFunctionNames(file, targetNames) {
  const text = fs.existsSync(file) ? require('fs').readFileSync(file, 'utf8') : null
  if (text === null) return []
  const out = []
  const lines = text.split('\n')
  lines.forEach((ln, i) => {
    const nm = /const \{([^}]+)\} = useCurrency\(\)/.exec(ln)
    if (!nm) return
    const names = nm[1].split(',').map(s => s.trim())
    if (!names.some(n => targetNames.has(n))) return
    // walk up for enclosing `function Foo(` or `const Foo = `
    for (let j = i; j >= 0; j--) {
      const fm = /^\s*(?:export\s+)?(?:default\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(lines[j])
      if (fm) { out.push({ name: fm[1], line: i + 1 }); break }
      const am = /^\s*(?:export\s+)?const\s+([A-Z][\w$]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.exec(lines[j])
      if (am) { out.push({ name: am[1], line: i + 1 }); break }
      const bm = /^\s*(?:export\s+)?const\s+([A-Z][\w$]*)\s*=\s*(?:function|\()/.exec(lines[j])
      if (bm) { out.push({ name: bm[1], line: i + 1 }); break }
    }
  })
  return out
}

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    if (['node_modules', '.next', 'dist', '.git'].includes(f)) continue
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(f)) out.push(p)
  }
  return out
}
const all = walk(join(ROOT, 'src')).map(p => p.replace(/\\/g, '/'))
const contents = new Map(all.map(p => [p, readFileSync(p, 'utf8')]))

const problems = []
let checked = 0
for (const [file, targetNames] of fileNames) {
  const fpath = join(ROOT, file)
  if (!existsSync(fpath)) continue
  const text = readFileSync(fpath, 'utf8')
  const fLines = text.split('\n')
  fLines.forEach((ln, i) => {
    const nm = /const \{([^}]+)\} = useCurrency\(\)/.exec(ln)
    if (!nm) return
    const names = nm[1].split(',').map(s => s.trim())
    if (!names.some(n => targetNames.has(n))) return
    // enclosing function name
    let fn = null
    for (let j = i; j >= 0; j--) {
      const fm = /^\s*(?:export\s+)?(?:default\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(fLines[j])
      if (fm) { fn = fm[1]; break }
      const am = /^\s*(?:export\s+)?const\s+([A-Z][\w$]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.exec(fLines[j])
      if (am) { fn = am[1]; break }
      const bm = /^\s*(?:export\s+)?const\s+([A-Z][\w$]*)\s*=\s*(?:function|\()/.exec(fLines[j])
      if (bm) { fn = bm[1]; break }
    }
    checked++
    if (!fn) {
      problems.push({ file, line: i + 1, fn: '(unknown)', reason: 'no enclosing named function found' })
      return
    }
    if (!/^[A-Z]/.test(fn)) {
      problems.push({ file, line: i + 1, fn, reason: 'enclosing function is NOT PascalCase (hook in non-component?)' })
      return
    }
    const jsx = new RegExp('<' + fn.replace(/[$]/g, '\\$') + '\\b')
    let used = false
    for (const [, c] of contents) {
      if (jsx.test(c)) { used = true; break }
    }
    if (!used) problems.push({ file, line: i + 1, fn, reason: 'NO JSX usage found anywhere in src/ — may be called as a plain function' })
  })
}

console.log(`checked ${checked} useCurrency() insertions across ${fileNames.size} files`)
if (!problems.length) { console.log('ALL OK — every inserted hook lives in a JSX-rendered component'); process.exit(0) }
console.log(`\nPROBLEMS (${problems.length}):`)
for (const p of problems) console.log(`  ${p.file}:${p.line}  ${p.fn}  — ${p.reason}`)
process.exit(1)

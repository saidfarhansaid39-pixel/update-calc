// Refined post-codemod safety check.
// For every function that received `= useCurrency()` in the diff, find real
// CALL sites `Name(args)` that are NOT:
//   - the function declaration itself (function Name( / const Name = )
//   - member access (obj.Name()
// Value-passing (const C = Name, <C/>, component={Name}) is safe — React
// invokes it as JSX, so hooks are legal. Only direct invocation is fatal.
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
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

// --- 1. collect inserted hook names from git diff ---
const diff = execSync('git diff -U0 -- src', {
  cwd: ROOT,
  maxBuffer: 64 * 1024 * 1024,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'], // suppress CRLF warnings on stderr
})
const fileNames = new Map()
let currentFile = null
for (const line of diff.split('\n')) {
  const m = /^diff --git a\/(.+?) b\/(.+)$/.exec(line)
  if (m) { currentFile = m[2]; continue }
  if (currentFile && line.startsWith('+') && !line.startsWith('+++')) {
    const nm = /const \{([^}]+)\} = useCurrency\(\)/.exec(line)
    if (nm) {
      const names = nm[1].split(',').map(s => s.trim()).filter(Boolean)
      if (!fileNames.has(currentFile)) fileNames.set(currentFile, new Set())
      for (const n of names) fileNames.get(currentFile).add(n)
    }
  }
}

// --- 2. resolve enclosing PascalCase function per insertion ---
const all = walk(join(ROOT, 'src'))
const entries = all.map(p => ({ p: p.replace(/\\/g, '/'), t: readFileSync(p, 'utf8') }))

const insertions = [] // {file, line, fn}
for (const [file, targetNames] of fileNames) {
  const abs = join(ROOT, file)
  if (!existsSync(abs)) continue
  const lines = readFileSync(abs, 'utf8').split('\n')
  lines.forEach((ln, i) => {
    const nm = /const \{([^}]+)\} = useCurrency\(\)/.exec(ln)
    if (!nm) return
    const names = nm[1].split(',').map(s => s.trim())
    if (!names.some(n => targetNames.has(n))) return
    for (let j = i; j >= 0; j--) {
      const fm = /^\s*(?:export\s+)?(?:default\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(lines[j])
      if (fm) { insertions.push({ file, line: i + 1, fn: fm[1] }); return }
      const am = /^\s*(?:export\s+)?const\s+([A-Z][\w$]*)\s*=/.exec(lines[j])
      if (am) { insertions.push({ file, line: i + 1, fn: am[1] }); return }
    }
    insertions.push({ file, line: i + 1, fn: null })
  })
}

// --- 3. for each unique fn, look for direct call sites across src ---
const uniqueFns = [...new Set(insertions.map(x => x.fn).filter(Boolean))]
const problems = []
for (const fn of uniqueFns) {
  const declRe = new RegExp(
    String.raw`(?:function\s+${fn}\s*\(|const\s+${fn}\s*=|(?:export|default)[^\n]*\bfunction\s+${fn}\s*\()`
  )
  const callRe = new RegExp(String.raw`(?<![.\w$])${fn}\s*\(`, 'g')
  for (const { p, t } of entries) {
    const lines = t.split('\n')
    lines.forEach((ln, i) => {
      callRe.lastIndex = 0
      let m
      while ((m = callRe.exec(ln)) !== null) {
        // skip declaration lines
        if (declRe.test(ln)) continue
        // skip imports / re-exports / type annotations
        if (/^\s*import\b/.test(ln)) continue
        // skip comments
        const before = ln.slice(0, m.index).trim()
        if (before.startsWith('//') || before.startsWith('*')) continue
        problems.push({ fn, file: p, line: i + 1, src: ln.trim().slice(0, 160) })
      }
    })
  }
}

console.log(`insertions: ${insertions.length}   unique hook-using functions: ${uniqueFns.length}`)
if (!problems.length) {
  console.log('ALL OK — no hook-using function is invoked as a plain function.')
  process.exit(0)
}
console.log(`\nDIRECT CALL SITES (${problems.length}) — these would break hook order:`)
for (const pr of problems) console.log(`  ${pr.fn}  ${pr.file}:${pr.line}\n      ${pr.src}`)
process.exit(1)

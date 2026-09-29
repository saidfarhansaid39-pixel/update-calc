// Repo-wide money-display scan outside the codemod's R4/R5 scope.
// Flags: (a) JSX text containing literal $, (b) string/template literals with
// $ + digit, (c) unwrapped {res.unit}/{step.value}-style renders.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, basename } from 'node:path'

function walk(d, out = []) {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(f)) out.push(p)
  }
  return out
}

// R5 scope = codemod already handled these (except exclusions noted below)
const inR5Scope = (rel) =>
  (/^src[\\/]components[\\/]hub-calculators[\\/]Generic[^\\/]*\.tsx$/.test(rel) ||
    /^src[\\/]components[\\/]calculator[\\/][^\\/]*\.tsx$/.test(rel) ||
    /^src[\\/]components[\\/]calc-panel[\\/][^\\/]*\.tsx$/.test(rel)) &&
  !/Article\.tsx$/.test(rel) &&
  !/calculator[\\/]Currency(Tables|Form|Calculator)\.tsx$/.test(rel) &&
  !/hub-calculators[\\/]GenericConversionCalculator\.tsx$/.test(rel)

const skipDirs = /node_modules|\.next[\\\/]dist|dist[\\\/]|out[\\\/]/
const files = walk('src').filter(f => !skipDirs.test(f))
const outScope = files.filter(f => !inR5Scope(relative('.', f).replace(/\\/g, '/')))

console.log(`total src ts files: ${files.length}, outside R4/R5 codemod scope: ${outScope.length}`)

const jsTextRe = />[^<>{}\n]*\$[^<>{}\n]*</ // JSX text containing $
const litRe = /['"`][^'"`\n]*\$[0-9][^'"`\n]*['"`]/ // string literal with $digit
const bareRenderRe = /\{(res|resultData|step|s)\.(unit|value)\}/ // unwrapped R4 target

for (const f of outScope) {
  const rel = relative('.', f).replace(/\\/g, '/')
  const lines = readFileSync(f, 'utf8').split('\n')
  lines.forEach((l, i) => {
    const why = []
    if (jsTextRe.test(l)) why.push('JSXTEXT')
    if (litRe.test(l)) why.push('LITERAL')
    if (bareRenderRe.test(l)) why.push('BARE-RENDER')
    if (why.length) console.log(`${why.join('+')} ${rel}:${i + 1}: ${l.trim().slice(0, 140)}`)
  })
}

// Find ANY literal $0 money text in string/JSX (excluding template ${ syntax).
import { readFileSync } from 'node:fs'
const files = readFileSync(process.env.TEMP + '/changed-files.txt', 'utf8').split('\n').map(s => s.trim()).filter(f => /\.tsx?$/.test(f))
const hits = []
for (const f of files) {
  let lines
  try { lines = readFileSync(f, 'utf8').split('\n') } catch { continue }
  lines.forEach((l, i) => {
    if (/\$0/.test(l)) hits.push(`${f.replace(/^.*Fichiers multiples./, '')}:${i + 1}: ${l.trim().slice(0, 170)}`)
  })
}
console.log(`$0 hits: ${hits.length}`)
for (const h of hits) console.log('  ' + h)

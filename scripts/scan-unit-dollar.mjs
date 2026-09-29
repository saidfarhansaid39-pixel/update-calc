// Where do compute defs emit unit: '$' (money unit), and do interpretation
// builders render that unit back into JSX?
import { execSync } from 'node:child_process'

function grep(pattern, dir) {
  try {
    const o = execSync(`git grep -n -E "${pattern}" -- ${dir}`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    return o.split('\n').filter(Boolean)
  } catch {
    return []
  }
}

const perHub = {}
for (const l of grep("unit: ['\"]\\$", 'src/components/hub-calculators')) {
  const hub = l.split('/')[2]
  perHub[hub] = (perHub[hub] || 0) + 1
}
console.log('unit: $ counts by file-dir:')
console.log(JSON.stringify(perHub, null, 1))

console.log('\n--- interpretation builders rendering unit ---')
for (const fn of ['getEverydayInterpretation', 'getMathInterpretation', 'getEngineeringInterpretation', 'getDateTimeInterpretation']) {
  const hits = grep(`${fn}\\(slug|function ${fn}`, 'src/components/hub-calculators')
  hits.slice(0, 6).forEach(h => console.log(h.slice(0, 140)))
}

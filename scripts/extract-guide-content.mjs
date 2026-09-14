// Extract ALL guide English strings + example content from guide-content.ts
import fs from 'fs'

// --- Part 1: Extract guide JSON strings ---
const en = JSON.parse(fs.readFileSync('src/i18n/messages/en.json','utf8'))
const enGuide = en.guide

function leafPaths(obj, path='') {
  const r = []
  for(const [k,v] of Object.entries(obj)) {
    const np = path ? path+'.'+k : k
    if(typeof v === 'string') r.push({path: np, val: v})
    else if(typeof v === 'object' && v) r.push(...leafPaths(v, np))
  }
  return r
}

const guideStrings = leafPaths(enGuide)
console.log('Guide strings:', guideStrings.length)

// --- Part 2: Extract example content from guide-content.ts ---
const src = fs.readFileSync('src/lib/seo/guide-content.ts', 'utf8')

// Extract formulaSource entries (these are math formulas, minimal translation needed)
const formulaSourceMap = {}
const formulaRegex = /'([\w-]+)'\s*:\s*'([^']+)'/g
let m
while ((m = formulaRegex.exec(src)) !== null) {
  formulaSourceMap[m[1]] = m[2]
}
console.log('FormulaSource entries:', Object.keys(formulaSourceMap).length)

// Extract category formulas
const catFormulas = {}
const catRegex = /(\w+):\s+'([^']+)'/g
// Read the specific section
const catStart = src.indexOf("const categoryFormulas: Record<string, string> = {")
const catEnd = src.indexOf("}", catStart)
const catSection = src.slice(catStart, catEnd)
const catLineRegex = /(\w[\w-]*):\s+'([^']+)'/g
let cm
while ((cm = catLineRegex.exec(catSection)) !== null) {
  catFormulas[cm[1]] = cm[2]
}
console.log('Category formulas:', Object.keys(catFormulas).length)

// Extract example data from getExampleValue function
// Find all return blocks with scenario, inputs, steps, result
const exampleObjs = []
// Match scenario: '...' patterns
const scenarioRegex = /scenario:\s*'([^']+)'/g
let sm
while ((sm = scenarioRegex.exec(src)) !== null) {
  exampleObjs.push({type: 'scenario', value: sm[1], index: sm.index})
}

// Extract steps
const stepRegex = /`([^`]+)`/g
// We need to find step arrays. Let's look for steps: [ ... ] patterns
const stepBlockRegex = /steps:\s*\[([\s\S]*?)\]\s*,\s*\n\s*result/g
let sbm
const stepBlocks = []
while ((sbm = stepBlockRegex.exec(src)) !== null) {
  const block = sbm[1]
  const steps = []
  const lineRegex = /`([^`]*)`/g
  let lm
  while ((lm = lineRegex.exec(block)) !== null) {
    steps.push(lm[1])
  }
  stepBlocks.push(steps)
}

// Extract result strings
const resultRegex = /result:\s*'([^']+)'/g
const results = []
let rm
while ((rm = resultRegex.exec(src)) !== null) {
  results.push(rm[1])
}

// Extract scenario strings before each result
const scenarios = []
const fullBlockRegex = /scenario:\s*'([^']+)'/g
let fbm
while ((fbm = fullBlockRegex.exec(src)) !== null) {
  scenarios.push(fbm[1])
}

// Write reference output
const output = {
  guideStrings,
  formulaSource: formulaSourceMap,
  categoryFormulas: catFormulas,
  examples: {
    scenarios,
    stepBlocks,
    results
  }
}

console.log('Scenarios:', scenarios.length)
console.log('Step blocks:', stepBlocks.length)
console.log('Results:', results.length)

// Save reference
fs.writeFileSync('/tmp/guide-strings.json', JSON.stringify(guideStrings.map(s=>s.path+'|'+s.val), null, 2))
fs.writeFileSync('/tmp/guide-examples.json', JSON.stringify({scenarios, stepBlocks, results}, null, 2))
console.log('\nSaved reference files')

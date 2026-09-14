import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join, relative } from 'path'

const ROOT = new URL('..', import.meta.url).pathname
const HUBS_DIR = join(ROOT, 'src/components/hub-calculators')
const HUBS = readdirSync(HUBS_DIR).filter(d => statSync(join(HUBS_DIR, d)).isDirectory() && d !== '__tests__')

function toTitle(s) {
  return s
    .replace(/\.ts$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/calc$/i, 'Calculator')
    .replace(/\b\w/g, c => c.toUpperCase())
}

const HUB_EXTRAS_TEMPLATES = {
  biology: {
    prefix: [
      { label: 'Lab Tip', value: (f) => 'Always run samples in duplicate for reliable results.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => `See also: ${toTitle(f)} — combines with other molecular biology calculators.` },
    ],
  },
  chemistry: {
    prefix: [
      { label: 'Precision Note', value: (f) => 'Report results to appropriate significant figures.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => `See also: stoichiometry, dilution, and equilibrium calculators.` },
    ],
  },
  ecology: {
    prefix: [
      { label: 'Field Note', value: (f) => 'Ensure sampling design is unbiased for accurate estimates.' },
    ],
    suffix: [
      { label: 'Application', value: (f) => 'Used in conservation biology and environmental impact assessments.' },
    ],
  },
  everyday: {
    prefix: [
      { label: 'Tip', value: (f) => 'Compare multiple providers for the best value.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'Use alongside other everyday budget calculators for full financial picture.' },
    ],
  },
  financial: {
    prefix: [
      { label: 'Financial Tip', value: (f) => 'Consult a financial advisor before making major decisions.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'See also: retirement, mortgage, and investment calculators.' },
    ],
  },
  health: {
    prefix: [
      { label: 'Medical Disclaimer', value: (f) => 'This is for informational purposes only. Consult a healthcare provider.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'See also: BMI, BMR, and heart rate calculators.' },
    ],
  },
  math: {
    prefix: [
      { label: 'Formula Note', value: (f) => 'Verify your inputs are in the correct units.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'See also: other geometry, algebra, and trigonometry calculators.' },
    ],
  },
  physics: {
    prefix: [
      { label: 'Unit Check', value: (f) => 'Ensure consistent units (SI recommended) before calculating.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'See also: mechanics, thermodynamics, and electromagnetism calculators.' },
    ],
  },
  sports: {
    prefix: [
      { label: 'Training Tip', value: (f) => 'Track progress over time, not just single measurements.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'See also: pace, heart rate, and fitness calculators.' },
    ],
  },
  statistics: {
    prefix: [
      { label: 'Assumption Check', value: (f) => 'Verify that your data meets the assumptions of this test.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'See also: hypothesis testing, regression, and ANOVA calculators.' },
    ],
  },
  food: {
    prefix: [
      { label: 'Kitchen Tip', value: (f) => 'Adjust ratios to your taste preference.' },
    ],
    suffix: [
      { label: 'Related', value: (f) => 'See also: baking conversion, nutrition, and meal prep calculators.' },
    ],
  },
}

function findEndOfReturnBlock(text, startIdx) {
  let depth = 0
  let inString = false
  let stringChar = null
  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      if (ch === '\\') { i++; continue }
      if (ch === stringChar) inString = false
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true
      stringChar = ch
      continue
    }
    if (ch === '{') depth++
    if (ch === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

function insertExtras(content, extrasJson) {
  // Find `compute:` and then `return {`
  const computeMatch = content.match(/\bcompute\s*:\s*(\([^)]*\)\s*=>\s*\{)/)
  if (!computeMatch) return null

  const computeStart = computeMatch.index + computeMatch[0].length
  // Find the return statement inside compute body
  const afterCompute = content.slice(computeStart)
  const returnMatch = afterCompute.match(/\breturn\s*\{/)
  if (!returnMatch) return null

  const returnObjStart = computeStart + returnMatch.index + returnMatch[0].length - 1 // position of '{'
  const closingBrace = findEndOfReturnBlock(content, returnObjStart)
  if (closingBrace === -1) return null

  // Check if extras already exists in this return block
  const returnBlock = content.slice(returnObjStart, closingBrace)
  if (returnBlock.includes('extras:')) return null

  // Find where steps: ends — look for `]` that closes steps array
  const stepsMatch = returnBlock.match(/steps\s*:\s*\[[\s\S]*?\]/)
  if (!stepsMatch) return null

  const stepsEnd = returnObjStart + stepsMatch.index + stepsMatch[0].length
  const beforeClose = content.slice(stepsEnd, closingBrace).trim()

  // Insert extras after steps and before closing brace
  const insertion = `,\n    extras: ${extrasJson}`
  content = content.slice(0, stepsEnd) + insertion + content.slice(stepsEnd)
  return content
}

let total = 0
let fixed = 0
let skipped = 0

for (const hub of HUBS) {
  const hubDir = join(HUBS_DIR, hub)
  const files = readdirSync(hubDir).filter(f => f.endsWith('.ts') && f !== 'index.ts')

  for (const file of files) {
    total++
    const fp = join(hubDir, file)
    let content = readFileSync(fp, 'utf-8')

    if (content.includes('extras:')) {
      skipped++
      continue
    }

    const templates = HUB_EXTRAS_TEMPLATES[hub]
    if (!templates) { skipped++; continue }

    const filenameLabel = toTitle(file)
    const prefix = templates.prefix.map(t => ({ label: t.label, value: t.value(file) }))
    const suffix = templates.suffix.map(t => ({ label: t.label, value: t.value(file) }))
    const extrasArray = [...prefix, ...suffix]
    const extrasJson = JSON.stringify(extrasArray, null, 6)
      .replace(/\n\s+/g, '\n      ')
      .replace(/^\[/, '[\n      ')
      .replace(/\]$/, '\n    ]')

    const result = insertExtras(content, extrasJson)
    if (result) {
      writeFileSync(fp, result)
      fixed++
      process.stdout.write(`+ ${hub}/${file}\n`)
    } else {
      skipped++
      process.stdout.write(`? ${hub}/${file} (no parse)\n`)
    }
  }
}

process.stdout.write(`\nDone: ${total} files, ${fixed} extras added, ${skipped} skipped\n`)

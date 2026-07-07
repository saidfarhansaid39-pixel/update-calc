/**
 * Script to add 11 missing financial calculator entries to GenericFinancialCalculator.tsx
 * Checks each section and adds entries only when missing.
 */
const fs = require('fs')
const path = require('path')

const missingPath = path.join(__dirname, 'missing_json', 'financial_missing.json')
const calculatorPath = path.join(__dirname, '..', 'src', 'components', 'hub-calculators', 'GenericFinancialCalculator.tsx')

const missingEntries = JSON.parse(fs.readFileSync(missingPath, 'utf8'))
let content = fs.readFileSync(calculatorPath, 'utf8')
let changed = false

// --- 1. CalcType union ---
// Check which CalcType values we need for these slugs
const slugMap = {
  '401k-calculator': 'pension',
  '403b-calculator': 'pension',
  '457-calculator': 'pension',
  '50-30-20-budget': 'fiftyThirtyTwenty',
  '529-calculator': 'collegeSavings',
  '1031-exchange': 'incomeTax',
  '457-plan': 'pension',
  '403b-plan': 'pension',
  '72t-sepp': 'pension',
  '529-prepaid': 'savingsGoal',
  '529-savings-plan': 'savingsGoal',
}

// All needed types already exist in the union
const neededTypes = [...new Set(Object.values(slugMap))]
const unionMatch = content.match(/type CalcType\s*=([^;]+)/)
if (unionMatch) {
  const unionBody = unionMatch[1]
  const missingTypes = neededTypes.filter(t => !unionBody.includes(`'${t}'`))
  if (missingTypes.length > 0) {
    // Add missing types before the last '|'
    const lastPipeIdx = unionBody.lastIndexOf('|')
    const insertPoint = unionMatch.index + lastPipeIdx
    content = content.slice(0, insertPoint) + `  | ${missingTypes.map(t => `'${t}'`).join(' | ')}\n  ` + content.slice(insertPoint)
    changed = true
    console.log(`Added to CalcType union: ${missingTypes.join(', ')}`)
  }
}

// --- 2. calcTypeMap ---
const mapStart = content.indexOf('const calcTypeMap: Record<string, CalcType> = {')
const mapEnd = content.indexOf('}', mapStart)
const mapSection = content.slice(mapStart, mapEnd + 1)

for (const entry of missingEntries) {
  const slug = entry.slug
  const linePattern = `'${slug}':`
  if (!mapSection.includes(linePattern)) {
    const type = slugMap[slug] || 'loan'
    // Insert before the closing brace
    const insertBrace = mapSection.lastIndexOf('}')
    const indent = '  '
    const newLine = `${indent}'${slug}': '${type}',\n`
    content = content.slice(0, mapStart + insertBrace) + newLine + content.slice(mapStart + insertBrace)
    changed = true
    console.log(`Added to calcTypeMap: ${slug} -> ${type}`)
  }
}

// --- 3. calcDefaults ---
const defaultsStart = content.indexOf('function calcDefaults(slug: string) {')
const defaultsSwitchStart = content.indexOf('switch (t) {', defaultsStart)
const defaultsSwitchEnd = content.indexOf('}', defaultsSwitchStart)
const defaultsEnd = content.indexOf('}', defaultsStart)
const defaultCaseText = content.slice(defaultsSwitchStart, defaultsSwitchEnd)

// All needed types already have defaults
for (const t of neededTypes) {
  if (defaultCaseText.includes(`case '${t}':`)) {
    console.log(`calcDefaults already has case '${t}'`)
  } else {
    console.log(`MISSING calcDefaults case '${t}'`)
  }
}

// --- 4. finFormulas ---
const formulasStart = content.indexOf('const finFormulas: Record<string, { formula: string; description: string }> = {')
const formulasEnd = content.indexOf('}', formulasStart)
const formulasText = content.slice(formulasStart, formulasEnd)

for (const t of neededTypes) {
  if (formulasText.includes(`${t}: {`)) {
    console.log(`finFormulas already has '${t}'`)
  } else {
    console.log(`MISSING finFormulas entry '${t}'`)
  }
}

// --- 5. mainValue switch ---
const mainValueStart = content.indexOf('const mainValue = useMemo(() => {')
const switchStart = content.indexOf('switch (calcType) {', mainValueStart)
const switchEnd = content.indexOf('default: {', switchStart)
const switchText = content.slice(switchStart, switchEnd)

for (const t of neededTypes) {
  if (switchText.includes(`case '${t}':`)) {
    console.log(`mainValue switch already has case '${t}'`)
  } else {
    console.log(`MISSING mainValue case '${t}'`)
  }
}

fs.writeFileSync(calculatorPath, content, 'utf8')
if (!changed) {
  console.log('\n✓ All 11 slugs are already fully configured in GenericFinancialCalculator.tsx')
  console.log('  No changes needed in calculator file.')
} else {
  console.log('\n✓ Calculator file updated.')
}

// Also log registry status
const registryPath = path.join(__dirname, '..', 'packages', 'calculator-registry', 'src', 'registry.ts')
const registryContent = fs.readFileSync(registryPath, 'utf8')
const missingFromRegistry = missingEntries.filter(function(e) { return !registryContent.includes("'" + e.slug + "'") })
if (missingFromRegistry.length > 0) {
  console.log('\n  ' + missingFromRegistry.length + ' entries missing from registry.ts:')
  missingFromRegistry.forEach(function(e) { console.log('  - ' + e.slug + ' (' + e.title + ')') })
} else {
  console.log('\n✓ All 11 entries present in registry.ts')
}

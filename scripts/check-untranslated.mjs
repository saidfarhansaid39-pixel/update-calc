import { readFileSync } from 'fs'
import { join } from 'path'

const dir = join(process.cwd(), 'src', 'i18n', 'messages')

function flattenKeys(obj, prefix = '') {
  const keys = []
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      keys.push(...flattenKeys(val, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

function getLeafValue(obj, path) {
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current === undefined || current === null) return undefined
    current = current[part]
  }
  return current
}

const files = {}
for (const locale of ['en', 'fr', 'de']) {
  files[locale] = JSON.parse(readFileSync(join(dir, `${locale}.json`), 'utf8'))
}

const enKeys = flattenKeys(files.en)

// Known cognates/technical terms that are legitimately the same in FR/DE
const cognates = new Set([
  'Finance', 'Date', 'Sports', 'Menu', 'Conversion', 'Construction', 'Guide',
  'Premium', 'Standard', 'Expert', 'Contact', 'Cookies', 'Variables', 'Variable',
  'Tools', 'optional',
  // Technical/scientific terms
  'VO2 Max', 'Shannon', 'Simpson', 'Katch-McArdle', 'Mifflin-St Jeor',
  // Currency codes (universal)
  'CAD (C$)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'USD ($)',
  // Date formats (universal)
  'DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY',
  // Diet/science terms
  'Keto', 'Paleo', 'Vegan', 'Normal', 'Linear', 'Elite',
  // Climate zones
  'Tropical', 'Arid', 'Boreal', 'Polar',
  // Other
  'Protist', 'Z-Score (3σ)', 'Odds Ratio', 'Gold', 'Notes',
  'Altitude (ft)', 'Concentration (mg/mL)', 'Volume (mL)',
  'Radians', 'Octal (8)',
  'Excellent (720+)', 'April',
])

// FR strings that SHOULD be translated
const frShouldTranslate = new Set([
  'nav.finance', 'nav.date', 'nav.sports', 'nav.menu',
  'footer.conversion', 'footer.construction', 'footer.sports',
  'hubs.name_conversion', 'hubs.name_construction',
  'common.guide', 'common.premium', 'common.standard', 'common.expert',
  'seo.contact',
  'guide.labels.variables', 'guide.labels.variable',
  'pages.privacy.cookiesTitle', 'pages.privacy.contactTitle',
])

// DE strings that SHOULD be translated
const deShouldTranslate = new Set([
  'nav.tools',
  'common.premium', 'common.standard', 'common.optional',
  'guide.labels.variable',
  'pages.privacy.cookiesTitle',
  'extraFields.region',
])

console.log('=== FR: NEEDS TRANSLATION ===\n')
let count = 0
for (const key of enKeys) {
  const enVal = getLeafValue(files.en, key)
  const frVal = getLeafValue(files.fr, key)
  if (typeof enVal === 'string' && typeof frVal === 'string' && enVal === frVal && enVal.length > 3) {
    if (cognates.has(enVal)) continue
    if (enVal.startsWith('{') || enVal.startsWith('#')) continue
    count++
    console.log(`  ${key}: "${enVal}"`)
  }
}
console.log(`\n  Total: ${count}`)

console.log('\n=== DE: NEEDS TRANSLATION ===\n')
count = 0
for (const key of enKeys) {
  const enVal = getLeafValue(files.en, key)
  const deVal = getLeafValue(files.de, key)
  if (typeof enVal === 'string' && typeof deVal === 'string' && enVal === deVal && enVal.length > 3) {
    if (cognates.has(enVal)) continue
    if (enVal.startsWith('{') || enVal.startsWith('#')) continue
    count++
    console.log(`  ${key}: "${enVal}"`)
  }
}
console.log(`\n  Total: ${count}`)

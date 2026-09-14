import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const HUBS_DIR = join(ROOT, 'src/components/hub-calculators')
const HUBS = readdirSync(HUBS_DIR).filter(d => statSync(join(HUBS_DIR, d)).isDirectory() && d !== '__tests__')

// ── Unit conversion functions ──────────────────────────────────────────
const UNIT_CONVERTERS = {
  // Mass
  'kg':  (v) => [{ l: 'g', v: (v * 1000).toFixed(2) }, { l: 'lb', v: (v * 2.20462).toFixed(3) }, { l: 'oz', v: (v * 35.274).toFixed(2) }],
  'g':   (v) => [{ l: 'kg', v: (v / 1000).toFixed(4) }, { l: 'lb', v: (v * 0.00220462).toFixed(5) }, { l: 'oz', v: (v * 0.035274).toFixed(3) }],
  'lb':  (v) => [{ l: 'kg', v: (v * 0.453592).toFixed(3) }, { l: 'oz', v: (v * 16).toFixed(1) }],
  // Length
  'm':   (v) => [{ l: 'cm', v: (v * 100).toFixed(1) }, { l: 'ft', v: (v * 3.28084).toFixed(3) }, { l: 'in', v: (v * 39.3701).toFixed(2) }],
  'cm':  (v) => [{ l: 'm', v: (v / 100).toFixed(4) }, { l: 'ft', v: (v * 0.0328084).toFixed(4) }, { l: 'in', v: (v * 0.393701).toFixed(2) }],
  'ft':  (v) => [{ l: 'm', v: (v * 0.3048).toFixed(3) }, { l: 'in', v: (v * 12).toFixed(1) }, { l: 'cm', v: (v * 30.48).toFixed(1) }],
  'in':  (v) => [{ l: 'cm', v: (v * 2.54).toFixed(2) }, { l: 'm', v: (v * 0.0254).toFixed(4) }],
  // Volume
  'L':   (v) => [{ l: 'mL', v: (v * 1000).toFixed(0) }, { l: 'gal (US)', v: (v * 0.264172).toFixed(4) }, { l: 'qt (US)', v: (v * 1.05669).toFixed(3) }, { l: 'fl oz', v: (v * 33.814).toFixed(1) }],
  'mL':  (v) => [{ l: 'L', v: (v / 1000).toFixed(4) }, { l: 'fl oz', v: (v * 0.033814).toFixed(2) }],
  // Speed
  'm/s': (v) => [{ l: 'km/h', v: (v * 3.6).toFixed(2) }, { l: 'mph', v: (v * 2.23694).toFixed(2) }, { l: 'knots', v: (v * 1.94384).toFixed(2) }, { l: 'ft/s', v: (v * 3.28084).toFixed(2) }],
  'km/h':(v) => [{ l: 'm/s', v: (v / 3.6).toFixed(3) }, { l: 'mph', v: (v * 0.621371).toFixed(2) }, { l: 'knots', v: (v * 0.539957).toFixed(2) }],
  'mph': (v) => [{ l: 'km/h', v: (v * 1.60934).toFixed(2) }, { l: 'm/s', v: (v * 0.44704).toFixed(3) }, { l: 'knots', v: (v * 0.868976).toFixed(2) }],
  // Temperature
  '°C':  (v) => [{ l: '°F', v: (v * 9/5 + 32).toFixed(1) }, { l: 'K', v: (v + 273.15).toFixed(2) }],
  '°F':  (v) => [{ l: '°C', v: ((v - 32) * 5/9).toFixed(1) }, { l: 'K', v: ((v - 32) * 5/9 + 273.15).toFixed(2) }],
  'K':   (v) => [{ l: '°C', v: (v - 273.15).toFixed(2) }, { l: '°F', v: ((v - 273.15) * 9/5 + 32).toFixed(1) }],
  // Energy
  'J':   (v) => [{ l: 'cal', v: (v / 4.184).toFixed(2) }, { l: 'Wh', v: (v / 3600).toFixed(4) }, { l: 'BTU', v: (v / 1055.06).toFixed(4) }, { l: 'eV', v: (v / 1.602e-19).toExponential(3) }],
  'kJ':  (v) => [{ l: 'kcal', v: (v / 4.184).toFixed(2) }, { l: 'Wh', v: (v / 3.6).toFixed(2) }, { l: 'BTU', v: (v / 1.05506).toFixed(2) }],
  'cal': (v) => [{ l: 'J', v: (v * 4.184).toFixed(2) }, { l: 'Wh', v: (v * 0.00116222).toFixed(4) }],
  // Power
  'W':   (v) => [{ l: 'kW', v: (v / 1000).toFixed(4) }, { l: 'hp (metric)', v: (v / 735.5).toFixed(5) }, { l: 'hp (mech)', v: (v / 745.7).toFixed(5) }, { l: 'BTU/h', v: (v * 3.41214).toFixed(2) }],
  'kW':  (v) => [{ l: 'W', v: (v * 1000).toFixed(0) }, { l: 'hp (metric)', v: (v / 0.7355).toFixed(3) }, { l: 'hp (mech)', v: (v / 0.7457).toFixed(3) }],
  'hp':  (v) => [{ l: 'kW', v: (v * 0.7457).toFixed(3) }, { l: 'W', v: (v * 745.7).toFixed(0) }],
  // Pressure
  'Pa':  (v) => [{ l: 'atm', v: (v / 101325).toFixed(6) }, { l: 'psi', v: (v / 6894.757).toFixed(4) }, { l: 'bar', v: (v / 100000).toFixed(6) }, { l: 'mmHg', v: (v / 133.322).toFixed(2) }],
  'atm': (v) => [{ l: 'Pa', v: (v * 101325).toFixed(0) }, { l: 'psi', v: (v * 14.6959).toFixed(3) }, { l: 'bar', v: (v * 1.01325).toFixed(4) }, { l: 'mmHg', v: (v * 760).toFixed(1) }],
  'psi': (v) => [{ l: 'Pa', v: (v * 6894.757).toFixed(0) }, { l: 'atm', v: (v / 14.6959).toFixed(4) }, { l: 'bar', v: (v / 14.5038).toFixed(4) }],
  'bar': (v) => [{ l: 'Pa', v: (v * 100000).toFixed(0) }, { l: 'atm', v: (v / 1.01325).toFixed(4) }, { l: 'psi', v: (v * 14.5038).toFixed(3) }],
  'mmHg':(v) => [{ l: 'Pa', v: (v * 133.322).toFixed(1) }, { l: 'atm', v: (v / 760).toFixed(5) }, { l: 'torr', v: v.toFixed(1) }],
  // Force
  'N':   (v) => [{ l: 'lbf', v: (v * 0.224809).toFixed(3) }, { l: 'kgf', v: (v / 9.80665).toFixed(3) }, { l: 'dyn', v: (v * 1e5).toExponential(2) }],
  'lbf': (v) => [{ l: 'N', v: (v * 4.44822).toFixed(2) }, { l: 'kgf', v: (v * 0.453592).toFixed(3) }],
  // Density
  'kg/m³': (v) => [{ l: 'g/cm³', v: (v / 1000).toFixed(4) }, { l: 'lb/ft³', v: (v * 0.062428).toFixed(3) }, { l: 'lb/gal', v: (v * 0.008345).toFixed(4) }],
  'kg/m^3':(v) => [{ l: 'g/cm³', v: (v / 1000).toFixed(4) }, { l: 'lb/ft³', v: (v * 0.062428).toFixed(3) }],
  'g/cm³':(v) => [{ l: 'kg/m³', v: (v * 1000).toFixed(0) }, { l: 'lb/ft³', v: (v * 62.428).toFixed(2) }],
  // Area
  'm²':  (v) => [{ l: 'ft²', v: (v * 10.7639).toFixed(2) }, { l: 'in²', v: (v * 1550).toFixed(0) }, { l: 'acres', v: (v / 4046.86).toFixed(5) }, { l: 'ha', v: (v / 10000).toFixed(5) }],
  'm^2': (v) => [{ l: 'ft²', v: (v * 10.7639).toFixed(2) }, { l: 'acres', v: (v / 4046.86).toFixed(5) }],
  'ft²': (v) => [{ l: 'm²', v: (v / 10.7639).toFixed(3) }, { l: 'acres', v: (v / 43560).toFixed(5) }],
  // Frequency
  'Hz':  (v) => [{ l: 'kHz', v: (v / 1000).toFixed(4) }, { l: 'MHz', v: (v / 1e6).toFixed(6) }, { l: 'GHz', v: (v / 1e9).toFixed(9) }, { l: 'rpm', v: (v * 60).toFixed(1) }],
  'kHz': (v) => [{ l: 'Hz', v: (v * 1000).toFixed(0) }, { l: 'MHz', v: (v / 1000).toFixed(4) }],
  'MHz': (v) => [{ l: 'Hz', v: (v * 1e6).toFixed(0) }, { l: 'GHz', v: (v / 1000).toFixed(4) }],
  // Time
  's':   (v) => [{ l: 'min', v: (v / 60).toFixed(3) }, { l: 'hr', v: (v / 3600).toFixed(5) }, { l: 'day', v: (v / 86400).toFixed(6) }],
  'min': (v) => [{ l: 's', v: (v * 60).toFixed(0) }, { l: 'hr', v: (v / 60).toFixed(3) }],
  'hr':  (v) => [{ l: 'min', v: (v * 60).toFixed(0) }, { l: 'day', v: (v / 24).toFixed(4) }],
  'day': (v) => [{ l: 'hr', v: (v * 24).toFixed(1) }, { l: 'wk', v: (v / 7).toFixed(2) }],
  // Torque
  'N·m': (v) => [{ l: 'lbf·ft', v: (v * 0.737562).toFixed(3) }, { l: 'kgf·m', v: (v / 9.80665).toFixed(3) }],
  // Momentum
  'kg·m/s': (v) => [{ l: 'N·s', v: v.toFixed(2) }, { l: 'lbf·s', v: (v * 0.224809).toFixed(3) }],
  // Electrical
  'V':   (v) => [{ l: 'kV', v: (v / 1000).toFixed(4) }, { l: 'mV', v: (v * 1000).toFixed(0) }],
  'A':   (v) => [{ l: 'mA', v: (v * 1000).toFixed(0) }, { l: 'kA', v: (v / 1000).toFixed(4) }],
  'Ω':   (v) => [{ l: 'kΩ', v: (v / 1000).toFixed(3) }, { l: 'MΩ', v: (v / 1e6).toFixed(6) }],
  // Concentration
  'M':   (v) => [{ l: 'mM', v: (v * 1000).toFixed(2) }, { l: 'µM', v: (v * 1e6).toFixed(0) }, { l: 'nM', v: (v * 1e9).toFixed(0) }, { l: 'mol/L', v: v.toFixed(4) }],
  'mol/L':(v) => [{ l: 'mM', v: (v * 1000).toFixed(2) }, { l: 'M', v: v.toFixed(4) }],
}

// ── Hub-specific competitor-style extra templates ──────────────────────
const HUB_EXTRAS = {
  biology: {
    common: [
      { label: 'Measurement note', value: 'Results depend on accurate input. Use calibrated instruments for precise data.' },
      { label: 'Clinical context', value: 'Reference ranges may vary by laboratory. Consult your healthcare provider.' },
      { label: 'WHO reference', value: 'World Health Organization guidelines used where applicable.' },
    ],
  },
  chemistry: {
    common: [
      { label: 'Precision note', value: 'Report results to appropriate significant figures based on input precision.' },
      { label: 'Temperature dependence', value: 'Concentration values may change with temperature. Consider using molality for precise work.' },
      { label: 'Related', value: 'See also: stoichiometry, dilution, buffer, and equilibrium calculators.' },
    ],
  },
  ecology: {
    common: [
      { label: 'Context', value: 'Global biocapacity: 1.6 gha/person. US: 8.1, EU: 4.5, World: 2.7 gha/person.' },
      { label: 'Planetary boundary', value: 'Sustainable living requires <1.6 gha/person footprint.' },
      { label: 'Application', value: 'Used in conservation biology, environmental policy, and sustainability assessments.' },
    ],
  },
  everyday: {
    common: [
      { label: 'Cost tip', value: 'Compare multiple providers and bulk options for best value.' },
      { label: 'Estimate note', value: 'This is an estimate. Actual results may vary based on local conditions and materials.' },
      { label: 'Pro tip', value: 'Add 10-15% buffer for waste, errors, and adjustments.' },
    ],
  },
  financial: {
    common: [
      { label: 'Disclaimer', value: 'This is for educational purposes. Consult a licensed financial advisor.' },
      { label: 'Inflation note', value: 'Historically, ~3% annual inflation reduces purchasing power over time.' },
      { label: 'Tax consideration', value: 'Tax implications vary by jurisdiction. Consult a tax professional.' },
    ],
  },
  food: {
    common: [
      { label: 'Serving note', value: 'Adjust quantities based on number of servings needed.' },
      { label: 'Dietary note', value: 'Consult a dietitian for personalized nutritional advice.' },
      { label: 'Substitution tip', value: 'Substitutions may alter taste, texture, and nutritional content.' },
    ],
  },
  health: {
    common: [
      { label: 'Medical disclaimer', value: 'This is for informational purposes only. Consult a healthcare provider.' },
      { label: 'Individual variation', value: 'Results may vary by age, sex, ethnicity, and medical history.' },
      { label: 'Trend note', value: 'Track measurements over time rather than relying on a single reading.' },
    ],
  },
  math: {
    common: [
      { label: 'Verification', value: 'Double-check inputs for accuracy. Small errors can compound.' },
      { label: 'Rounding note', value: 'Results rounded to standard precision. Adjust rounding in your own calculations.' },
      { label: 'Related', value: 'See also: algebra, geometry, calculus, and trigonometry calculators.' },
    ],
  },
  physics: {
    common: [
      { label: 'SI units', value: 'All values in SI units unless otherwise noted.' },
      { label: 'Ideal conditions', value: 'Results assume ideal conditions. Real-world values may differ.' },
      { label: 'Related', value: 'See also: mechanics, thermodynamics, electromagnetism, and optics calculators.' },
    ],
  },
  sports: {
    common: [
      { label: 'Training tip', value: 'Track progress consistently rather than comparing single measurements.' },
      { label: 'Rest note', value: 'Adequate rest and recovery are essential for performance gains.' },
      { label: 'Individual variation', value: 'Results vary by age, fitness level, and training history.' },
    ],
  },
  statistics: {
    common: [
      { label: 'Assumption check', value: 'Verify your data meets the assumptions of this test before drawing conclusions.' },
      { label: 'Sample size note', value: 'Larger samples provide more reliable estimates.' },
      { label: 'Effect size', value: 'Consider reporting effect size alongside p-value for complete interpretation.' },
    ],
  },
}

// ── Result-label-based classification templates ────────────────────────
const LABEL_CLASSIFIERS = {
  'BMI': (v) => {
    const cat = v < 16 ? 'Severe thinness' : v < 17 ? 'Moderate thinness' : v < 18.5 ? 'Mild thinness' : v < 25 ? 'Normal' : v < 30 ? 'Overweight' : v < 35 ? 'Obese I' : v < 40 ? 'Obese II' : 'Obese III'
    return [
      { l: 'WHO classification', v: cat },
      { l: 'BMI Prime', v: (v / 25).toFixed(3) },
      { l: 'Health risk', v: v < 18.5 ? 'Increased (malnutrition risk)' : v < 25 ? 'Low (normal range)' : v < 30 ? 'Increased (overweight)' : v < 35 ? 'High (obese I)' : v < 40 ? 'Very high (obese II)' : 'Extremely high (obese III)' },
    ]
  },
  'Force': (v) => [{ l: 'Comparable to', v: v > 5000 ? 'Car crash impact force' : v > 1000 ? 'Human punch (~1000 N)' : v > 100 ? 'Heavy door push' : v > 10 ? 'Light object push' : 'Insect force' }],
  'Pressure': (v) => [{ l: 'vs atmospheric', v: v > 101325 ? `${(v/101325).toFixed(2)}× atmospheric` : `${(v/101325*100).toFixed(1)}% of atmospheric` }],
  'Momentum': (v) => [{ l: 'Comparable to', v: v > 1000 ? 'Car collision momentum' : v > 100 ? 'Baseball fastball' : v > 10 ? 'Bicycle momentum' : 'Light object' }],
  'Velocity': (v) => [{ l: 'Comparable to', v: v >= 343 ? 'Supersonic!' : v >= 100 ? 'High speed (race car)' : v >= 30 ? 'Highway speed' : v >= 5 ? 'Running speed' : v >= 1.4 ? 'Walking speed' : 'Slow movement' }],
  'Acceleration': (v) => [{ l: 'Comparable to', v: Math.abs(v) >= 9.81 ? `${(Math.abs(v)/9.81).toFixed(1)}× gravity (g)` : `${(Math.abs(v)/9.81*100).toFixed(1)}% of gravity` }],
  'Wavelength': (v) => {
    const band = v > 1e-1 ? 'Radio' : v > 1e-3 ? 'Microwave' : v > 7e-7 ? 'Infrared' : v > 4e-7 ? 'Visible' : v > 1e-8 ? 'Ultraviolet' : v > 1e-11 ? 'X-ray' : 'Gamma'
    return [{ l: 'EM spectrum band', v: band }]
  },
  'Pearson r': (v) => {
    const a = Math.abs(v)
    return [{ l: 'Evan\'s scale', v: a >= 0.8 ? 'Very strong' : a >= 0.6 ? 'Strong' : a >= 0.4 ? 'Moderate' : a >= 0.2 ? 'Weak' : 'Very weak' }, { l: 'R²', v: (v*v).toFixed(4) }]
  },
  'Molarity': (v) => [{ l: 'Dilution needed for 0.1 M', v: v > 0.1 ? `${(v/0.1).toFixed(1)}×` : 'Already dilute' }],
  'Density': (v) => [{ l: 'Buoyancy in water', v: v > 1000 ? 'Sinks' : v > 997 ? 'Nearly neutral' : 'Floats' }],
  'Force': (v) => [{ l: 'Can lift', v: (v / 9.80665).toFixed(2) + ' kg' }],
  'Energy': (v) => [
    { l: 'Can lift', v: (v / (9.81 * 9.81)).toFixed(2) + ' kg' },
    { l: 'Heating water (1L, +1°C)', v: v >= 4186 ? `${(v/4186).toFixed(2)} °C` : 'Less than 1°C' },
  ],
  'Heat Energy': (v) => [{ l: 'Lift equivalent', v: (v / 9.81).toFixed(2) + ' kg lifted 1 m' }],
  'Power': (v) => [{ l: 'Comparable to', v: v > 1e6 ? 'Power plant scale' : v > 1000 ? 'Industrial machine' : v > 100 ? 'Household appliance' : v > 1 ? 'Human output' : 'Small electronic' }],
}

// ── Parse helpers ──────────────────────────────────────────────────────
function findEndOfReturnBlock(text, startIdx) {
  let depth = 0, inString = false, stringChar = null
  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      if (ch === '\\') { i++; continue }
      if (ch === stringChar) inString = false
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue }
    if (ch === '{') depth++
    if (ch === '}') { depth--; if (depth === 0) return i }
  }
  return -1
}

// String-aware finder for matching bracket — skips over string contents
function findMatchingBracket(text, startIdx, open, close) {
  let depth = 1, inString = false, stringChar = null
  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      if (ch === '\\') { i++; continue }
      if (ch === stringChar) inString = false
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue }
    if (ch === open) depth++
    if (ch === close) { depth--; if (depth === 0) return i }
  }
  return -1
}

// Find the actual closing bracket of `steps: [...]` — string-aware
function findStepsEnd(text, returnObjStart) {
  const stepsMatch = text.slice(returnObjStart).match(/\bsteps\s*:\s*\[/)
  if (!stepsMatch) return -1
  const arrStart = returnObjStart + stepsMatch.index + stepsMatch[0].length
  return findMatchingBracket(text, arrStart, '[', ']')
}

function extractResultUnit(content) {
  const labelMatch = content.match(/\blabel\s*:\s*['"]([^'"]+)['"]/)
  const unitMatch = content.match(/\bunit\s*:\s*['"]([^'"]+)['"]/)
  const resultMatch = content.match(/\bresult:\s*([^,\n]+)/)
  return { label: labelMatch?.[1] || '', unit: unitMatch?.[1] || '', resultVar: resultMatch?.[1]?.trim() || '' }
}

function extractFieldUnits(content) {
  const fields = []
  const fieldRegex = /\{\s*name\s*:\s*['"]([^'"]+)['"][^}]*?(?:unit\s*:\s*['"]([^'"]+)['"])?[^}]*?\}/g
  let m
  while ((m = fieldRegex.exec(content)) !== null) {
    fields.push({ name: m[1], unit: m[2] || '' })
  }
  return fields
}

function extractValueLabelVar(returnBlock) {
  // Try to find what variable or expression is returned as result
  const ret = returnBlock.match(/\bresult\s*:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\b/)
  return ret ? ret[1].trim() : null
}

function extractReturnBlock(content) {
  const computeMatch = content.match(/\bcompute\s*:\s*(\([^)]*\)\s*=>\s*\{)/)
  if (!computeMatch) return null
  const computeStart = computeMatch.index + computeMatch[0].length
  const afterCompute = content.slice(computeStart)
  const returnMatch = afterCompute.match(/\breturn\s*\{/)
  if (!returnMatch) return null
  const returnObjStart = computeStart + returnMatch.index + returnMatch[0].length - 1
  const closingBrace = findEndOfReturnBlock(content, returnObjStart)
  if (closingBrace === -1) return null
  return { block: content.slice(returnObjStart, closingBrace + 1), start: returnObjStart, end: closingBrace + 1 }
}

// ── Main enhancement logic ─────────────────────────────────────────────
function generateExtras(content, hub) {
  const extras = []
  const ret = extractReturnBlock(content)
  if (!ret) return null
  if (ret.block.includes('extras:')) return null // already has extras

  const info = extractResultUnit(content)
  const fields = extractFieldUnits(content)
  const resultVar = extractValueLabelVar(ret.block)

  // 1. Hub-level common extras
  const hubTmpl = HUB_EXTRAS[hub]
  if (hubTmpl) {
    for (const t of hubTmpl.common) {
      extras.push({ label: t.label, value: t.value })
    }
  }

  return { extras, ret, info, resultVar, fields }
}

function buildExtrasJSArray(extrasList, resultVar, unit, converter) {
  if (!extrasList || extrasList.length === 0) return null
  const items = extrasList.map(e => {
    let val = e.value
    // Replace result placeholders
    if (val.includes('{{')) {
      val = val.replace(/\{\{[^}]+\}\}/g, '${' + resultVar + '}')
    }
    // Try to inline as expression
    return `      { label: ${JSON.stringify(e.label)}, value: ${JSON.stringify(val)} }`
  })
  return `extras: [\n${items.join(',\n')}\n    ]`
}

function insertExtras(content, extrasJson) {
  const ret = extractReturnBlock(content)
  if (!ret) return null
  if (ret.block.includes('extras:')) return null

  const closeIdx = ret.end - 1

  // Find the end of the steps array, string-aware
  const stepsEnd = findStepsEnd(content, ret.start)

  let insertPoint = closeIdx
  if (stepsEnd !== -1) {
    insertPoint = stepsEnd + 1 // right after the `]`
    // Skip past any comma and whitespace after `]`
    const after = content.slice(insertPoint, closeIdx)
    const skipMatch = after.match(/^\s*,?\s*/)
    if (skipMatch) insertPoint += skipMatch[0].length
  }

  const insertion = `,\n    ${extrasJson}`
  return content.slice(0, insertPoint) + insertion + content.slice(insertPoint)
}

// ── Main ───────────────────────────────────────────────────────────────
let total = 0, fixed = 0, skipped = 0

for (const hub of HUBS) {
  const hubDir = join(HUBS_DIR, hub)
  let files
  try { files = readdirSync(hubDir).filter(f => f.endsWith('.ts') && f !== 'index.ts') } catch { continue }

  for (const file of files) {
    total++
    const fp = join(hubDir, file)
    let content = readFileSync(fp, 'utf-8')

    if (content.includes('extras:')) {
      skipped++
      continue
    }

    const result = generateExtras(content, hub)
    if (!result) { skipped++; continue }

    const { extras, info, resultVar } = result
    if (!extras || extras.length === 0) { skipped++; continue }

    // Build extras as a proper JS extras array (hub-level informational only)
    const allItems = extras.map(e =>
      `      { label: ${JSON.stringify(e.label)}, value: ${JSON.stringify(e.value)} }`
    )
    const extrasStr = 'extras: [\n' + allItems.join(',\n') + '\n    ]'

    const modified = insertExtras(content, extrasStr)
    if (modified) {
      writeFileSync(fp, modified)
      fixed++
      process.stdout.write(`+ ${hub}/${file}\n`)
    } else {
      skipped++
      process.stdout.write(`? ${hub}/${file} (no parse)\n`)
    }
  }
}

process.stdout.write(`\nDone: ${total} files, ${fixed} extras added, ${skipped} skipped\n`)

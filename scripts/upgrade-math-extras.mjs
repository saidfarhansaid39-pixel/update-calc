import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const DIR = 'C:/Users/store one/Pictures/calculatora/MpB2M28jkJJIYqVynKKb/Fichiers multiples/src/components/hub-calculators/math'
const INDEX = 'index.ts'

// ── Category templates ──────────────────────────────────────────────────
const EXTRAS_TEMPLATES = {

  geometry: [
    { label: 'Real-World Application', value: 'Used in architecture, engineering, and design for spatial calculations.' },
    { label: 'Formula Derivation', value: 'Derived from geometric definitions and spatial relationships.' },
    { label: 'Unit Check', value: 'All lengths must be in the same unit for accurate results.' },
    { label: 'Precision Note', value: 'Uses standard geometric constants for calculation.' },
    { label: 'Related Shapes', value: 'Explore volume and area calculators for other 2D and 3D shapes.' },
  ],

  trigonometry: [
    { label: 'Unit Circle Reference', value: 'Angles measured from positive x-axis counterclockwise.' },
    { label: 'Common Angle Values', value: 'sin(0°)=0, sin(30°)=0.5, sin(45°)=0.707, sin(60°)=0.866, sin(90°)=1.' },
    { label: 'Pythagorean Identity', value: 'sin²θ + cos²θ = 1 — fundamental trigonometric relationship.' },
    { label: 'Radian vs Degree', value: 'Switch between degree and radian mode depending on your problem.' },
    { label: 'Periodic Nature', value: 'Trigonometric functions repeat every 360° (2π radians).' },
  ],

  algebra: [
    { label: 'Solution Methods', value: 'Can be solved via factoring, formula, or graphical methods.' },
    { label: 'Discriminant Insight', value: 'The discriminant reveals the number and type of solutions.' },
    { label: 'Graphical Meaning', value: 'Solutions correspond to x-intercepts on the graph.' },
    { label: 'Checking Solutions', value: 'Substitute results back into the original equation to verify.' },
    { label: 'Real vs Complex', value: 'Real solutions appear when discriminant ≥ 0; otherwise complex.' },
  ],

  numberTheory: [
    { label: 'Mathematical Significance', value: 'Fundamental concept in number theory and discrete mathematics.' },
    { label: 'Computational Note', value: 'Large inputs may require optimized algorithms for performance.' },
    { label: 'Historical Context', value: 'Studied by mathematicians across centuries for its unique properties.' },
    { label: 'Related Sequences', value: 'Related to other integer sequences and special numbers.' },
    { label: 'Pattern Recognition', value: 'Observe recurring patterns and relationships between values.' },
  ],

  calculus: [
    { label: 'Convergence Check', value: 'Ensure the method converges for your specific problem parameters.' },
    { label: 'Error Bound', value: 'Numerical methods have inherent approximation error — smaller steps reduce it.' },
    { label: 'Step Size Impact', value: 'Smaller step sizes improve accuracy but increase computation time.' },
    { label: 'Real Applications', value: 'Used in physics, engineering, and economics for dynamic systems.' },
    { label: 'Numerical vs Analytical', value: 'Numerical methods approximate; analytical solutions are exact.' },
  ],

  matrix: [
    { label: 'Dimension Check', value: 'Matrix dimensions must be compatible for the operation.' },
    { label: 'Singular Matrix Warning', value: 'A determinant of zero means the matrix has no inverse.' },
    { label: 'Computational Complexity', value: 'Larger matrices require significantly more computation.' },
    { label: 'Application', value: 'Used in computer graphics, machine learning, and physics simulations.' },
  ],

  combinatorics: [
    { label: 'Counting Principle', value: 'Understand whether order matters (permutations) or not (combinations).' },
    { label: 'Large Number Warning', value: 'Factorials and combinatorial values grow extremely fast.' },
    { label: 'Real-World Use', value: 'Used in probability, statistics, game theory, and algorithm analysis.' },
    { label: 'Formula Reference', value: 'nCr = n! / (r!(n-r)!) for combinations; nPr = n! / (n-r)! for permutations.' },
  ],

  everyday: [
    { label: 'How It Works', value: 'Simple percentage-based calculation applied to your input values.' },
    { label: 'Common Use Case', value: 'Used in shopping, budgeting, and everyday financial decisions.' },
    { label: 'Input Requirements', value: 'All monetary values should be in the same currency.' },
    { label: 'Accuracy Note', value: 'Results rounded to 2 decimal places for standard currency format.' },
  ],

  general: [
    { label: 'How It Works', value: 'Performs the calculation step by step using standard formulas.' },
    { label: 'Common Use Case', value: 'Used when you need a quick and accurate mathematical result.' },
    { label: 'Input Requirements', value: 'Ensure all inputs are valid numbers within acceptable ranges.' },
    { label: 'Accuracy Note', value: 'Floating point precision may affect results at extreme values.' },
  ],
}

// ── Category classification ─────────────────────────────────────────────
function classify(name) {
  const f = name.toLowerCase().replace(/\.ts$/, '')

  // Geometry
  const geoKW = /^(area|volume|perimeter|circumference|surface-area|circle|sphere|cone|cylinder|pyramid|prism|cube|rectangle|square|triangle|polygon|hexagon|octagon|pentagon|parallelogram|rhombus|trapezoid|kite|sector|segment|annulus|ellipse|ellipsoid|torus|frustum|capsule|hemisphere|cap|arc-length|pythagorean|law-of-cosines|law-of-sines|right-triangle|similar-triangles|oblique-triangle|triangle-area|triangle-centroid|triangle-circumcenter|triangle-incenter|triangle-inequality|geometry-|30-60-90|45-45-90|crescent-area|barrel-volume|spherical-cap|spherical-segment|sphere-surface|cone-surface|cylinder-surface|cube-surface|regular-polygon|sector-area|segment-area|distance-between-points|midpoint-calculator|rectangular-prism)/
  if (geoKW.test(f)) return 'geometry'

  // Trigonometry
  const trigKW = /^(sin-?|cos-?|tan-?|arcsin|arccos|arctan|sinh|cosh|tanh|asinh|acosh|atanh|trig-|unit-circle|double-angle|half-angle|inverse-trig|sum-difference|trig-identities|trig-table|trig-graphs)/
  if (trigKW.test(f)) return 'trigonometry'

  // Algebra
  const algKW = /^(algebra-|quadratic|polynomial|cubic|linear-equation|discriminant|factoring|foil-method|inequality-solver|domain-and-range|interval-notation|function-calculator|simplify-fraction|rational-expression|radical-expression|absolute-value|partial-fractions|binomial-|complex-number|diophantine|point-slope-form|slope-intercept|slope-calculator|line-equation|system-of-)/
  if (algKW.test(f)) return 'algebra'

  // Number Theory
  const numKW = /^(prime|factorial|gcd|lcm|sieve|mersenne|twin-prime|goldbach|euler-totient|mobius|collatz|palindrome|armstrong|perfect-number|abundant-number|bell-numbers|bernoulli-numbers|catalan-numbers|lucas-numbers|derangements|double-factorial|eulerian-numbers|padovan-sequence|pell-numbers|perrin-sequence|stirling-|superfactorial|tribonacci|modular-|chinese-remainder|continued-fraction|babylonian-square-root|newton-square-root|square-root|roman-numeral|binary-hex|number-base|scientific-notation|significant-figures|rounding-calculator|fibonacci|pascal-triangle)/
  if (numKW.test(f)) return 'numberTheory'

  // Calculus / Numerical Methods
  const calcKW = /^(derivative|riemann-sum|trapezoidal-rule|simpson-|midpoint-rule|euler-method|runge-kutta|heun-method|adams-bashforth|adams-moulton|crank-nicolson|dormand-prince|finite-difference|bisection-method|newton-raphson|secant-method|false-position|fixed-point|calculus-|romberg|boole-rule|gauss-(chebyshev|hermite|l aguerre|legendre)|jacobi-iteration|gauss-seidel|conjugate-gradient|taylor-series|series-calculator|sequence-calculator|lagrange-interpolation|spline-interpolation|pade-approximant|minimax-polynomial|horners-method|divided-difference|newton-forward|newton-backward|bilinear-interpolation|linear-interpolation|numerical)/
  if (calcKW.test(f)) return 'calculus'

  // Matrix / Linear Algebra
  const matKW = /^(matrix-|determinant|transpose|inverse-matrix|lu-decomposition|cholesky|qr-decomposition|singular-value|eigenvalue|eigenvector|vector-|scalar-triple-product|resultant-calc)/
  if (matKW.test(f)) return 'matrix'

  // Combinatorics
  const combKW = /^(permutation|combination|binomial-coefficient|multinomial-coefficient|circular-permutations|derangements|pascal-triangle)/
  if (combKW.test(f)) return 'combinatorics'

  // Everyday / Finance
  const everydayKW = /^(discount-?|percentage|tip-calculator|sales-tax|profit-margin|markup-|break-even|ratio-calculator|proportion-|compare-fractions|fraction-|decimal-|percent-|mixed-number|improper-to-mixed|mixed-to-improper)/
  if (everydayKW.test(f)) return 'everyday'

  // Statistics (skip — already good or in stats hub)
  const statKW = /^(statistics|mean|median|z-score|p-value|percentile|quartile|iqr|correlation|covariance|spearman|effect-size|mann-whitney|wilcoxon|expected-value|confidence-interval|margin-of-error|normal-probability|poisson-probability|binomial-probability|bayes)/
  if (statKW.test(f)) return 'statistics'

  // Fallback for remaining files — classify by secondary keywords
  if (/^(annulus|prism-volume|rectangular-prism|cylinder|sphere)/.test(f)) return 'geometry'
  if (/^(log-|logarithm|natural-log|exponent|nth-root|cube-root)/.test(f)) return 'algebra'
  if (/^(arithmetic|tower-of-hanoi)/.test(f)) return 'numberTheory'

  return 'general'
}

// ── Preset generators per field type ────────────────────────────────────
function generatePresets(fileContent, filename) {
  // If already has presets, return null (skip)
  if (/\bpresets\s*:/.test(fileContent)) return null

  const f = filename.toLowerCase()

  // Geometry area/volume — numeric single field
  if (/^(area|volume|circle|sphere|cone|cylinder|cube|triangle-area|square-area|rectangle-area|parallelogram-area|trapezoid-area|kite-area|rhombus-area|hexagon-area|octagon-area|pentagon-area|ellipse-area|annulus-area|sector-area|segment-area|prism-volume|pyramid-volume|cylinder-volume|cone-volume|sphere-volume|cube-volume|cylinder-surface|sphere-surface|cone-surface|cube-surface|hemisphere-volume|capsule-volume|frustum-volume|barrel-volume|torus-volume|ellipsoid-volume|spherical-cap|spherical-segment)/.test(f))
    return [
      { label: 'Small', values: { a: '2' } },
      { label: 'Medium', values: { a: '5' } },
      { label: 'Large', values: { a: '10' } },
    ]

  // Geometry with two fields (length/width, radius/height)
  if (/^(cylinder-calculator|cone-calculator|sphere-calculator|cube-calculator|pyramid-calculator|rectangular-prism|trapezoid-calculator|kite-calculator|parallelogram-calc|annulus-calculator|sector-calculator|segment-calculator|torus-calculator|ellipse-calculator|hexagon-calculator|octagon-calculator|polygon-calculator|right-triangle|oblique-triangle)/.test(f))
    return [
      { label: 'Small', values: { a: '3', b: '4' } },
      { label: 'Medium', values: { a: '6', b: '8' } },
      { label: 'Large', values: { a: '10', b: '12' } },
    ]

  // Pythagorean / distance
  if (/pythagorean/.test(f))
    return [
      { label: '3-4-5 Triangle', values: { a: '3', b: '4' } },
      { label: '5-12-13 Triangle', values: { a: '5', b: '12' } },
      { label: '8-15-17 Triangle', values: { a: '8', b: '15' } },
    ]

  if (/distance-between-points/.test(f))
    return [
      { label: 'Simple', values: { x1: '0', y1: '0', x2: '3', y2: '4' } },
      { label: 'Negative', values: { x1: '-2', y1: '1', x2: '4', y2: '-3' } },
    ]

  // Trigonometry
  if (/^(sin-?|cos-?|tan-?|arcsin|arccos|arctan|sinh|cosh|tanh|asinh|acosh|atanh)/.test(f))
    return [
      { label: 'Common 30°', values: { a: '30' } },
      { label: 'Common 45°', values: { a: '45' } },
      { label: 'Common 60°', values: { a: '60' } },
    ]

  // Algebra — quadratic
  if (/quadratic/.test(f))
    return [
      { label: 'Two Real Roots', values: { a: '1', b: '-3', c: '2' } },
      { label: 'Double Root', values: { a: '1', b: '-4', c: '4' } },
      { label: 'Complex Roots', values: { a: '1', b: '0', c: '1' } },
    ]

  if (/discriminant/.test(f))
    return [
      { label: 'Two Real Roots', values: { a: '1', b: '-5', c: '6' } },
      { label: 'No Real Roots', values: { a: '1', b: '0', c: '1' } },
      { label: 'Double Root', values: { a: '1', b: '-4', c: '4' } },
    ]

  if (/factoring/.test(f))
    return [
      { label: 'Simple', values: { a: '1', b: '-3', c: '2' } },
      { label: 'With GCF', values: { a: '2', b: '-8', c: '6' } },
    ]

  // Number theory
  if (/prime/.test(f))
    return [
      { label: 'Small Prime', values: { a: '7' } },
      { label: 'Composite', values: { a: '12' } },
      { label: 'Large Prime', values: { a: '97' } },
    ]

  if (/fibonacci/.test(f))
    return [
      { label: 'Position 5', values: { a: '5' } },
      { label: 'Position 10', values: { a: '10' } },
      { label: 'Position 20', values: { a: '20' } },
    ]

  if (/factorial/.test(f))
    return [
      { label: 'Small 5', values: { a: '5' } },
      { label: 'Medium 10', values: { a: '10' } },
      { label: 'Large 20', values: { a: '20' } },
    ]

  if (/^(gcd|lcm)/.test(f))
    return [
      { label: 'Coprime', values: { a: '7', b: '11' } },
      { label: 'Common', values: { a: '12', b: '18' } },
      { label: 'Multiple', values: { a: '24', b: '36' } },
    ]

  if (/modular-inverse/.test(f))
    return [
      { label: 'Prime modulus', values: { a: '3', m: '11' } },
      { label: 'Composite no inverse', values: { a: '6', m: '9' } },
    ]

  // Matrix
  if (/matrix/.test(f)) {
    if (/\b2x2\b/.test(f) || /^2x2/.test(f) || /-2x2/.test(f))
      return [
        { label: 'Identity', values: { a: '1', b: '0', c: '0', d: '1' } },
        { label: 'Integer', values: { a: '1', b: '2', c: '3', d: '4' } },
      ]
    if (/\b3x3\b/.test(f) || /^3x3/.test(f) || /-3x3/.test(f))
      return [
        { label: 'Identity', values: { a: '1', b: '0', c: '0', d: '0', e: '1', f: '0', g: '0', h: '0', i: '1' } },
        { label: 'Simple', values: { a: '1', b: '2', c: '3', d: '0', e: '1', f: '4', g: '5', h: '6', i: '0' } },
      ]
    const fieldsMatch = fileContent.match(/fields:\s*\[[\s\S]*?numField\((\S+?),\s*['"][^'"]+['"]\)/)
    if (fieldsMatch) return [{ label: 'Example', values: { a: '1', b: '0', c: '0', d: '1' } }]
    return null
  }

  // Algebra — linear equations
  if (/linear-equation/.test(f))
    return [
      { label: 'Simple', values: { a: '2', b: '4' } },
      { label: 'Negative Slope', values: { a: '-3', b: '6' } },
    ]

  if (/system-of-2/.test(f))
    return [
      { label: 'Independent', values: { a1: '1', b1: '1', c1: '5', a2: '1', b2: '-1', c2: '1' } },
      { label: 'No Solution', values: { a1: '1', b1: '1', c1: '1', a2: '2', b2: '2', c2: '4' } },
    ]

  if (/system-of-3/.test(f))
    return [
      { label: 'Simple', values: { a1: '1', b1: '0', c1: '0', d1: '1', a2: '0', b2: '1', c2: '0', d2: '2', a3: '0', b3: '0', c3: '1', d3: '3' } },
    ]

  // Calculus
  if (/derivative/.test(f))
    return [
      { label: 'At x=2', values: { x: '2' } },
      { label: 'At x=5', values: { x: '5' } },
    ]

  if (/euler-method|runge-kutta|heun|adams|dormand/.test(f))
    return [
      { label: 'Fine grain', values: { x0: '0', y0: '1', h: '0.1', steps: '10' } },
      { label: 'Coarse', values: { x0: '0', y0: '1', h: '0.2', steps: '5' } },
    ]

  // Number theory miscellaneous
  if (/sieve/.test(f))
    return [
      { label: 'Up to 20', values: { a: '20' } },
      { label: 'Up to 50', values: { a: '50' } },
    ]

  if (/collatz/.test(f))
    return [
      { label: 'Start 6', values: { a: '6' } },
      { label: 'Start 27', values: { a: '27' } },
    ]

  // Everyday
  if (/percentage/.test(f))
    return [
      { label: '50% of 200', values: { a: '200', b: '50' } },
      { label: '25% of 80', values: { a: '80', b: '25' } },
    ]

  if (/discount/.test(f))
    return [
      { label: '20% off $100', values: { a: '100', b: '20' } },
      { label: '50% off $40', values: { a: '40', b: '50' } },
    ]

  if (/tip/.test(f))
    return [
      { label: '15% tip $50', values: { a: '50', b: '15' } },
      { label: '20% tip $75', values: { a: '75', b: '20' } },
    ]

  if (/sales-tax/.test(f))
    return [
      { label: '8% on $100', values: { a: '100', b: '8' } },
      { label: '10% on $250', values: { a: '250', b: '10' } },
    ]

  // General fallback
  return [{ label: 'Default', values: {} }]
}

// ── Ensure defaults exist ───────────────────────────────────────────────
function needsDefaults(fileContent, fieldKeys) {
  if (/\bdefaults\s*:/.test(fileContent)) return false
  if (!fieldKeys.length) return false
  const def = {}
  fieldKeys.forEach(k => { def[k] = '1' })
  return def
}

// ── Extract field keys ──────────────────────────────────────────────────
function getFieldKeys(fileContent) {
  const keys = []
  const re = /numField\(['"](\w+)['"]/g
  let m
  while ((m = re.exec(fileContent)) !== null) keys.push(m[1])
  return [...new Set(keys)]
}

// ── Check if a file has the generic extras ──────────────────────────────
const GENERIC_PATTERN = '{ label: "Verification", value: "Double-check inputs for accuracy. Small errors can compound." }'

function hasGenericExtras(content) {
  return content.includes(GENERIC_PATTERN)
}

// ── Check if a file already has domain-specific extras ──────────────────
function hasCustomExtras(content) {
  // Has extras but doesn't have the generic verification pattern
  if (!content.includes('extras:')) return false // no extras at all
  if (hasGenericExtras(content)) return false // has generic extras, needs replacement
  // Check for specific extra labels that aren't the generic ones
  if (/\bextras\s*:\s*\[[\s\S]*?\{/.test(content)) {
    // Has extras defined; if not generic, consider it custom
    return !hasGenericExtras(content)
  }
  return false
}

// ── Main ────────────────────────────────────────────────────────────────
function main() {
  const files = readdirSync(DIR).filter(f => f.endsWith('.ts') && f !== INDEX)
  let replaced = 0, skipped = 0, errors = 0, custom = 0

  for (const file of files) {
    const fp = join(DIR, file)
    let content
    try { content = readFileSync(fp, 'utf8') } catch (e) { console.error(`ERROR reading ${file}: ${e.message}`); errors++; continue }

    const hadGeneric = hasGenericExtras(content)
    const fields = getFieldKeys(content)

    // 1. Replace generic extras
    if (hadGeneric) {
      const category = classify(file)
      let template = EXTRAS_TEMPLATES[category] || EXTRAS_TEMPLATES.general

      // Build the replacement extras section
      const extrasStr = 'extras: [\n' + template.map((e, i) => {
        const comma = i < template.length - 1 ? ',' : ''
        return `      { label: "${e.label}", value: "${e.value}" }${comma}`
      }).join('\n') + '\n    ]'

      // Find the generic extras block and replace it
      // Pattern: extras: [\n  ...generic extras...\n    ]
      const genericBlock = /extras:\s*\[[\s\S]*?\{[^}]*"Verification"[^}]*\}[^}]*\}[^}]*\}[^]]*\]/
      const match = content.match(genericBlock)
      if (match) {
        content = content.replace(match[0], extrasStr)
      } else {
        // Try simpler: find from "extras: [" to the "]"
        const startIdx = content.indexOf('extras: [')
        if (startIdx >= 0) {
          const afterBracket = content.indexOf('[', startIdx)
          let depth = 0, endIdx = afterBracket
          for (let i = afterBracket; i < content.length; i++) {
            if (content[i] === '[') depth++
            else if (content[i] === ']') { depth--; if (depth === 0) { endIdx = i + 1; break } }
          }
          content = content.substring(0, startIdx) + extrasStr + content.substring(endIdx)
        } else {
          console.error(`  ERROR: Could not locate extras in ${file}`)
          errors++
          continue
        }
      }
      replaced++
    } else if (content.includes('extras:')) {
      // Has extras but not generic — skip (already custom)
      custom++
      try { writeFileSync(fp, content, 'utf8') } catch (e) { console.error(`ERROR writing ${file}: ${e.message}`); errors++ }
      continue
    } else {
      // No extras — add them
      const category = classify(file)
      const template = EXTRAS_TEMPLATES[category] || EXTRAS_TEMPLATES.general
      const extrasStr = 'extras: [\n' + template.map((e, i) => {
        const comma = i < template.length - 1 ? ',' : ''
        return `      { label: "${e.label}", value: "${e.value}" }${comma}`
      }).join('\n') + '\n    ]'

      // Find last closing ) of the return statement and insert before it... this is tricky.
      // Instead, find the end of the compute function's return
      // Look for the pattern: return { ... steps: [...], extras: [...] } or similar
      // Actually, if there are no extras, we need to add them near the end of the return
      // Let's handle this per common pattern
      console.error(`  WARNING: ${file} has no extras section — skipping extras addition`)
      errors++
      continue
    }

    // 2. Add presets if missing
    if (content.indexOf('presets:') === -1) {
      const presets = generatePresets(content, file)
      if (presets && presets.length > 0) {
        // Find the end of calcDef (before export) and add presets
        const exportIdx = content.indexOf('\nexport default calcDef')
        const lastPropEnd = content.lastIndexOf('}', exportIdx - 1)
        if (lastPropEnd > 0) {
          const before = content.substring(0, lastPropEnd).trimEnd()
          const after = content.substring(lastPropEnd)
          let presetsStr = ',\n    presets: [\n'
          presets.forEach((p, i) => {
            const vals = Object.entries(p.values).map(([k, v]) => `${k}: '${v}'`).join(', ')
            const comma = i < presets.length - 1 ? ',' : ''
            presetsStr += `      { label: '${p.label}', values: { ${vals} } }${comma}\n`
          })
          presetsStr += '    ]\n'
          content = before + presetsStr + after
        }
      }
    }

    // 3. Ensure defaults
    if (needsDefaults(content, fields)) {
      console.error(`  WARNING: ${file} has no defaults — skipping`)
    }

    // Write
    try { writeFileSync(fp, content, 'utf8') } catch (e) { console.error(`ERROR writing ${file}: ${e.message}`); errors++ }
  }

  // Post-check: count files still with generic extras
  let remaining = 0
  for (const file of files) {
    const fp = join(DIR, file)
    try {
      const content = readFileSync(fp, 'utf8')
      if (hasGenericExtras(content)) remaining++
    } catch (e) {}
  }

  console.log(`\n=== RESULTS ===`)
  console.log(`Total files processed: ${files.length}`)
  console.log(`Files with generic extras replaced: ${replaced}`)
  console.log(`Files already with good extras (skipped): ${custom}`)
  console.log(`Errors: ${errors}`)
  console.log(`\nRemaining files with "Verification" generic label: ${remaining}`)
  if (remaining === 0) console.log(`✓ All generic extras eliminated!`)
}

main()

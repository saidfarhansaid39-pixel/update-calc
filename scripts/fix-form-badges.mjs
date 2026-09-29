// Add useCurrency + replace hardcoded $ input-prefix badges with {currencySymbol}
// in the 7 standalone form files (components/calculators/* — outside codemod scope).
import { readFileSync, writeFileSync } from 'node:fs'

const files = [
  'src/components/calculators/AmortizationForm.tsx',
  'src/components/calculators/APRForm.tsx',
  'src/components/calculators/AutoLoanForm.tsx',
  'src/components/calculators/InterestRateForm.tsx',
  'src/components/calculators/MortgageForm.tsx',
  'src/components/calculators/PersonalLoanForm.tsx',
  'src/components/calculators/RefinanceForm.tsx',
]

let totalBadges = 0
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n')
  const base = f.split('/').pop().replace(/\.tsx$/, '')

  // 1. badge replacement
  let badges = 0
  for (let i = 0; i < lines.length; i++) {
    const before = lines[i]
    const after = before.replace(
      /(<span className="bg-\[#e6e6e6\][^>]*>)\$(<\/span>)/g,
      '$1{currencySymbol}$2'
    )
    if (after !== before) {
      badges += (before.match(/\$<\/span>/g) || []).length
      lines[i] = after
    }
  }

  if (badges === 0) {
    console.log(`${base}: 0 badges — SKIPPED`)
    continue
  }

  // 2. import (skip if present)
  let importAdded = false
  if (!/from '@\/lib\/context\/CurrencyContext'/.test(lines.join('\n'))) {
    let lastImport = -1
    for (let i = 0; i < lines.length; i++) {
      if (/^import\s/.test(lines[i]) || /^\}\s*from\s/.test(lines[i])) lastImport = i
    }
    if (lastImport === -1) throw new Error(`${f}: no import line found`)
    lines.splice(lastImport + 1, 0, "import { useCurrency } from '@/lib/context/CurrencyContext'")
    importAdded = true
  }

  // 3. hook right after the component function opening line
  let hookAdded = false
  for (let i = 0; i < lines.length; i++) {
    if (new RegExp(`^(export\\s+)?(default\\s+)?function\\s+${base}\\b`).test(lines[i])) {
      if (!/useCurrency\(\)/.test(lines.slice(i, i + 40).join('\n'))) {
        lines.splice(i + 1, 0, '  const { currencySymbol } = useCurrency()')
        hookAdded = true
      }
      break
    }
  }
  if (!hookAdded && !/useCurrency\(\)/.test(lines.join('\n'))) throw new Error(`${f}: hook not inserted`)

  writeFileSync(f, lines.join('\n'))
  console.log(`${base}: ${badges} badges, import=${importAdded}, hook=${hookAdded}`)
  totalBadges += badges
}
console.log(`total badges fixed: ${totalBadges}`)

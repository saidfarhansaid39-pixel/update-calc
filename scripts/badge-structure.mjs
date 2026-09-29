// Report component structure + existing useCurrency usage for the 7 badge files.
import { readFileSync } from 'node:fs'

const files = [
  'src/components/calculators/AmortizationForm.tsx',
  'src/components/calculators/APRForm.tsx',
  'src/components/calculators/AutoLoanForm.tsx',
  'src/components/calculators/InterestRateForm.tsx',
  'src/components/calculators/MortgageForm.tsx',
  'src/components/calculators/PersonalLoanForm.tsx',
  'src/components/calculators/RefinanceForm.tsx',
]

for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n')
  console.log(`\n=== ${f} (${lines.length} lines) ===`)
  lines.forEach((l, i) => {
    if (/^\s*(export\s+)?(default\s+)?function\s+[A-Z]\w*/.test(l) || /useCurrency\(/.test(l) || /CurrencyContext/.test(l) || />\s*\$\s*</.test(l)) {
      console.log(`${i + 1}: ${l.trim().slice(0, 120)}`)
    }
  })
}

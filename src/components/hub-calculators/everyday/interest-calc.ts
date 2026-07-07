import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ principal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'principal', label: 'Principal ($)', type: 'number', min: 1, step: '500' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'years', label: 'Time (years)', type: 'number', min: 0.5, step: '1' },
  ],
  compute: (v) => { const p = parseFloat(v.principal)||0; const r = parseFloat(v.rate)||0 / 100; const y = parseFloat(v.years)||0; const simpleInterest = p * r * y; const simpleTotal = p + simpleInterest; const compoundTotal = p * Math.pow(1 + r, y); const compoundInterest = compoundTotal - p; const monthlySimple = simpleInterest / (y * 12); return { result: simpleInterest, label: 'Simple Interest', unit: '$', steps: [{ label: 'Principal', value: `$${p.toFixed(2)}` }, { label: 'Simple Interest', value: `$${simpleInterest.toFixed(2)}` }, { label: 'Simple Total', value: `$${simpleTotal.toFixed(2)}` }, { label: 'Compound Total (annual)', value: `$${compoundTotal.toFixed(2)}` }, { label: 'Interest Difference', value: `$${(compoundInterest - simpleInterest).toFixed(2)}` }] } },
  description: 'Calculate both simple and compound interest on any principal amount. Compare how compounding accelerates growth over time.',
  formula: 'Simple = P × r × t | Compound = P × (1+r)^t',
  interpretation: 'Compounding frequency matters: daily > monthly > annually. At 7% over 30 years, $10,000 grows to $76,123 (compounded) vs $31,000 (simple). Einstein called compounding the eighth wonder of the world.'
}

export default calcDef

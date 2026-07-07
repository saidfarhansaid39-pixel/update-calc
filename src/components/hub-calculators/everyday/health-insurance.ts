import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyPremium: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), annualDeductible: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), copay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), visitsPerYear: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyPremium', label: 'Monthly Premium ($)', type: 'number', min: 50, step: '50' },
    { name: 'annualDeductible', label: 'Annual Deductible ($)', type: 'number', min: 0, step: '500' },
    { name: 'copay', label: 'Copay per Visit ($)', type: 'number', min: 0, step: '10' },
    { name: 'visitsPerYear', label: 'Doctor Visits per Year', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const p = parseFloat(v.monthlyPremium)||0; const d = parseFloat(v.annualDeductible)||0; const c = parseFloat(v.copay)||0; const vis = parseFloat(v.visitsPerYear)||0; const premiumTotal = p * 12; const copayTotal = c * vis; const total = premiumTotal + d + copayTotal; const moAvg = total / 12; return { result: total, label: 'Annual Health Cost', unit: '$', steps: [{ label: 'Annual Premium', value: `$${premiumTotal.toFixed(2)}` }, { label: 'Deductible', value: `$${d.toFixed(2)}` }, { label: 'Copay Total', value: `$${copayTotal.toFixed(2)}` }, { label: 'Total Annual', value: `$${total.toFixed(2)}` }, { label: 'Monthly Avg', value: `$${moAvg.toFixed(2)}/mo` }] } },
  description: 'Estimate total annual health insurance costs including premiums, deductibles, and copays. Compare plans side by side.',
  formula: 'Annual Cost = (Premium × 12) + Deductible + (Copay × Visits)',
  interpretation: 'HDHPs (high-deductible) have lower premiums but higher out-of-pocket. HSA-eligible plans offer tax advantages. Bronze plans ~$550/mo, Gold ~$800/mo average.'
}

export default calcDef

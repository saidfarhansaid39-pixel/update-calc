import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ principal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'principal', label: 'Initial Investment ($)', type: 'number', min: 0, step: '100' },
    { name: 'monthly', label: 'Monthly Contribution ($)', type: 'number', min: 0, step: '50' },
    { name: 'rate', label: 'Annual Return Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'years', label: 'Years', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const r = v.rate / 100 / 12
    const n = v.years * 12
    const fv = v.principal * Math.pow(1 + r, n) + v.monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    const totalContrib = v.principal + v.monthly * n
    const earnings = fv - totalContrib
    return { result: fv, label: 'Future Value', unit: '$', steps: [{ label: 'Total Contributions', value: `$${totalContrib.toFixed(2)}` }, { label: 'Total Earnings', value: `$${earnings.toFixed(2)}` }, { label: 'Future Value', value: `$${fv.toFixed(2)}` }] }
  },
  description: 'Project the future value of an investment with compound interest and recurring monthly contributions. Uses the future value of an annuity formula.',
  formula: 'FV = PV×(1+r)^n + PMT×[((1+r)^n-1)/r]×(1+r) where r = monthly rate, n = total months',
  interpretation: 'Higher returns and earlier contributions dramatically increase final value due to compound interest. Even small monthly additions grow significantly over decades.'
}

export default calcDef

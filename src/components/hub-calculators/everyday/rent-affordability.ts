import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyDebts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rulePct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), utilities: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyIncome', label: 'Monthly Gross Income ($)', type: 'number', min: 500, step: '500' },
    { name: 'monthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', min: 0, step: '50' },
    { name: 'rulePct', label: 'Max Rent % of Income', type: 'number', min: 10, max: 50, step: '5' },
    { name: 'utilities', label: 'Estimated Utilities ($)', type: 'number', min: 0, step: '50' },
  ],
  compute: (v) => {
    const maxRent = v.monthlyIncome * (v.rulePct / 100)
    const afterDebts = maxRent - v.monthlyDebts
    const afterUtilities = afterDebts - v.utilities
    const safeRent = Math.max(0, afterDebts)
    return { result: safeRent, label: 'Affordable Rent', unit: '$', steps: [{ label: `Max Rent (${v.rulePct}% rule)`, value: `$${maxRent.toFixed(0)}` }, { label: 'After Debts', value: `$${afterDebts.toFixed(0)}` }, { label: 'After Utilities', value: `$${afterUtilities.toFixed(0)}` }, { label: 'Annual Income Needed', value: `$${(v.monthlyIncome * 12).toFixed(0)}` }] }
  },
  description: 'Determine affordable monthly rent based on income, existing debts, and utilities using the percentage-based rent rule.',
  formula: 'Affordable = (Income × Rule%) - Debts - Utilities',
  interpretation: 'The 30% rule is standard: spend ≤30% of gross income on rent. Landlords typically require rent ≤30% of income and 620+ credit score. Factor in utilities (electric, water, internet) as they add $100-300/month.'
}

export default calcDef

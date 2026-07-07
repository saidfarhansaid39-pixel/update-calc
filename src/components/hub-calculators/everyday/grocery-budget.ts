import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weeks: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeklyBudget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), householdSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'weeks', label: 'Number of Weeks', type: 'number', min: 1, step: '1' },
    { name: 'weeklyBudget', label: 'Weekly Budget ($)', type: 'number', min: 10, step: '10' },
    { name: 'householdSize', label: 'Household Size', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const w = parseFloat(v.weeks)||0; const wb = parseFloat(v.weeklyBudget)||0; const hs = parseFloat(v.householdSize)||0; const total = w * wb * hs; const perPerson = wb * w; return { result: total, label: 'Total Grocery Budget', unit: '$', steps: [{ label: 'Weekly Household Budget', value: `$${(wb * hs).toFixed(2)}` }, { label: 'Budget for Period', value: `$${total.toFixed(2)}` }, { label: 'Per Person per Period', value: `$${perPerson.toFixed(2)}` }] } },
  description: 'Plan your grocery budget over any time period based on weekly spending and household size.',
  formula: 'Total = Weeks × Weekly Budget × Household Size',
  interpretation: 'USDA moderate plan: $75-150/person/week. Buying in bulk, seasonal produce, and store brands can cut costs 20-30%.'
}

export default calcDef

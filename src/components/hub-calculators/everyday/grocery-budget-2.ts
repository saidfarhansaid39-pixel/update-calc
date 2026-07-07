import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ householdSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeklySpend: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), eatingOutPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'householdSize', label: 'Household Size', type: 'number', min: 1, step: '1' },
    { name: 'weeklySpend', label: 'Weekly Grocery Spend ($)', type: 'number', min: 10, step: '20' },
    { name: 'eatingOutPct', label: 'Budget for Eating Out (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const monthlyGroceries = v.weeklySpend * 4.33
    const perPerson = v.weeklySpend / v.householdSize
    const eatingOut = monthlyGroceries * (v.eatingOutPct / 100)
    const totalFood = monthlyGroceries + eatingOut
    return { result: monthlyGroceries, label: 'Monthly Grocery Budget', unit: '$', steps: [{ label: 'Weekly Spend', value: `$${v.weeklySpend.toFixed(2)}` }, { label: 'Monthly Groceries', value: `$${monthlyGroceries.toFixed(2)}` }, { label: 'Monthly Eating Out', value: `$${eatingOut.toFixed(2)}` }, { label: 'Total Monthly Food', value: `$${totalFood.toFixed(2)}` }, { label: 'Per Person per Week', value: `$${perPerson.toFixed(2)}` }] }
  },
  description: 'Plan your household grocery budget based on household size, weekly spending, and dining out percentage. Track total monthly food costs.',
  formula: 'Monthly = Weekly × 4.33 + Eating Out | Per Person = Weekly / Household Size',
  interpretation: 'USDA average: $300-500/person/month for groceries. Eating out costs 2-3× more than cooking at home. Budget 10-15% of income for total food costs.'
}

export default calcDef

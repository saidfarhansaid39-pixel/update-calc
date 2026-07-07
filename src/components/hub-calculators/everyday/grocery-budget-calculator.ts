import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ numPeople: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeklyBudgetPerPerson: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), includeNonFood: z.string().min(1) }),
  fields: [
    { name: 'numPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'weeklyBudgetPerPerson', label: 'Budget per Person per Week ($)', type: 'number', min: 10, step: '10' },
    { name: 'includeNonFood', label: 'Include Non-Food Items', type: 'select', options: [{ label: 'Yes (add 15%)', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const weeklyFood = v.numPeople * v.weeklyBudgetPerPerson
    const nonFoodMultiplier = v.includeNonFood === 'yes' ? 1.15 : 1
    const weeklyTotal = weeklyFood * nonFoodMultiplier
    const monthlyTotal = weeklyTotal * 4.33
    const annualTotal = weeklyTotal * 52
    return { result: monthlyTotal, label: 'Monthly Grocery Budget', unit: '$', steps: [{ label: 'Weekly Food', value: `$${weeklyFood.toFixed(2)}` }, { label: 'Weekly with Non-Food', value: `$${weeklyTotal.toFixed(2)}` }, { label: 'Monthly', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Create a comprehensive grocery budget for your household including non-food essentials like cleaning products and toiletries.',
  formula: 'Monthly = (People × Budget/Person/Week × NonFood%) × 4.33',
  interpretation: 'Non-food items (paper products, cleaning supplies) add 10-20% to grocery bills. Shop with a list and avoid impulse buys to reduce spending by 20%.'
}

export default calcDef

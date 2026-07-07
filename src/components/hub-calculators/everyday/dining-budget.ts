import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mealsPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), people: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), deliveryFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'mealsPerWeek', label: 'Dining Out Meals/Week', type: 'number', min: 1, step: '1' },
    { name: 'costPerMeal', label: 'Avg Cost per Meal ($)', type: 'number', min: 1, step: '5' },
    { name: 'people', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'deliveryFee', label: 'Delivery Fee/Tip ($)', type: 'number', min: 0, step: '2' },
  ],
  compute: (v) => {
    const weekly = v.mealsPerWeek * (v.costPerMeal + v.deliveryFee) * v.people
    const monthly = weekly * 4.33
    const annual = weekly * 52
    return { result: monthly, label: 'Monthly Dining Budget', unit: '$', steps: [{ label: 'Weekly Spend', value: `$${weekly.toFixed(0)}` }, { label: 'Monthly Spend', value: `$${monthly.toFixed(0)}` }, { label: 'Annual Spend', value: `$${annual.toFixed(0)}` }] }
  },
  description: 'Calculate your dining out and delivery budget. See the true cost of restaurant meals, takeout, and delivery including fees and tips.',
  formula: 'Monthly = Meals/Week × (Cost + Fee) × People × 4.33',
  interpretation: 'The average American spends $3,000-4,000/yr dining out. Cooking at home costs 60-70% less. Reducing dining out by 2 meals/week saves $1,500-2,500/yr.'
}

export default calcDef

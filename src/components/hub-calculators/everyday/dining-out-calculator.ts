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
    const potentialSavings = monthly * 0.3
    return { result: monthly, label: 'Monthly Dining Out Cost', unit: '$', steps: [{ label: 'Weekly Cost', value: `$${weekly.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthly.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annual.toFixed(2)}` }, { label: 'Potential Savings (cook 30% more)', value: `$${potentialSavings.toFixed(2)}/mo` }] }
  },
  description: 'Calculate how much you spend dining out or ordering delivery each month. Enter meals per week, cost per meal, and number of people.',
  formula: 'Monthly = (Meals/Week × (Cost + Delivery) × People) × 4.33',
  interpretation: 'Average American spends $3,000-5,000/year dining out. Cooking at home costs 60-70% less per meal. Cutting 2 restaurant meals/week can save $200-400/month. Brown-bagging lunch saves $50-150/month.'
}

export default calcDef

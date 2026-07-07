import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dailyMeals: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), people: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'dailyMeals', label: 'Meals per Day', type: 'number', min: 1, step: '1' },
    { name: 'costPerMeal', label: 'Avg Cost per Meal ($)', type: 'number', min: 1, step: '1' },
    { name: 'people', label: 'Number of People', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const m = parseFloat(v.dailyMeals)||0; const c = parseFloat(v.costPerMeal)||0; const p = parseFloat(v.people)||0; const daily = m * c * p; const weekly = daily * 7; const monthly = daily * 30; return { result: monthly, label: 'Monthly Food Budget', unit: '$', steps: [{ label: 'Daily Cost', value: `$${daily.toFixed(2)}` }, { label: 'Weekly Cost', value: `$${weekly.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthly.toFixed(2)}` }] } },
  description: 'Plan your monthly food budget by meals per day, average cost per meal, and household size. Includes all meals and snacks.',
  formula: 'Monthly = Meals/Day × Cost/Meal × People × 30',
  interpretation: 'USDA thrifty plan: ~$300/person/month. Moderate: ~$400. Liberal: ~$500+. Cooking at home saves 60% vs dining out.'
}

export default calcDef

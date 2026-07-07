import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tvcTakeoutMeals: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tvcTakeoutCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tvcCookMeals: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tvcCookCostPer: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tvcCookTimeMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'tvcTakeoutMeals', label: 'Takeout Meals/Week', type: 'number', min: 1, step: '1' },
    { name: 'tvcTakeoutCost', label: 'Avg Takeout Cost ($)', type: 'number', min: 5, step: '5' },
    { name: 'tvcCookMeals', label: 'Home-Cooked Meals/Week', type: 'number', min: 0, step: '1' },
    { name: 'tvcCookCostPer', label: 'Avg Home-Cooked Cost ($)', type: 'number', min: 1, step: '2' },
    { name: 'tvcCookTimeMin', label: 'Cooking Time per Meal (min)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const weeklyTakeout = v.tvcTakeoutMeals * v.tvcTakeoutCost
    const weeklyCook = v.tvcCookMeals * v.tvcCookCostPer
    const totalWeekly = weeklyTakeout + weeklyCook
    const monthlyTotal = totalWeekly * 4.33
    const annualTotal = totalWeekly * 52
    const weeklyCookTime = v.tvcCookMeals * v.tvcCookTimeMin
    return { result: totalWeekly, label: 'Total Weekly Food Cost', unit: '$', steps: [{ label: 'Takeout', value: '$' + weeklyTakeout.toFixed(2) }, { label: 'Home-Cooked', value: '$' + weeklyCook.toFixed(2) }, { label: 'Weekly Total', value: '$' + totalWeekly.toFixed(2) }, { label: 'Monthly', value: '$' + monthlyTotal.toFixed(2) }, { label: 'Annual', value: '$' + annualTotal.toFixed(2) }, { label: 'Cooking Time/Week', value: weeklyCookTime + ' min' }] }
  },
  description: 'Compare the cost of takeout versus home-cooked meals. See weekly, monthly, and annual spending with time investment.',
  formula: 'Weekly = TakeoutMeals x $ + CookMeals x $ | Annual = Weekly x 52 | Takeout: $15-25/meal | Home-cooked: $3-8/meal',
  interpretation: 'Home cooking saves 60-70% per meal. A $20 takeout meal costs ~$5-7 to make at home. Cooking 5 extra meals/week saves $3,000-5,000/year. Factor in ~30 min cooking vs 15 min ordering time.'
}

export default calcDef

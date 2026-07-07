import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mealsCooked: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mealsWasted: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), avgMealCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'mealsCooked', label: 'Meals Cooked per Week', type: 'number', min: 1, step: '1' },
    { name: 'mealsWasted', label: 'Meals Wasted per Week', type: 'number', min: 0, step: '1' },
    { name: 'avgMealCost', label: 'Avg Cost per Meal ($)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const mc = parseFloat(v.mealsCooked)||0; const mw = parseFloat(v.mealsWasted)||0; const ac = parseFloat(v.avgMealCost)||0; const wastePct = mc > 0 ? (mw / mc) * 100 : 0; const weeklyWaste = mw * ac; const annualWaste = weeklyWaste * 52; return { result: wastePct, label: 'Food Waste Rate', unit: '%', steps: [{ label: 'Waste %', value: `${wastePct.toFixed(1)}%` }, { label: 'Weekly Waste Value', value: `$${weeklyWaste.toFixed(2)}` }, { label: 'Annual Waste Value', value: `$${annualWaste.toFixed(2)}` }] } },
  description: 'Track household food waste by comparing meals cooked vs wasted. Calculate the financial and environmental impact of food waste.',
  formula: 'Waste% = (Meals Wasted ÷ Meals Cooked) × 100 | Annual $ = Meals Wasted × Cost × 52',
  interpretation: 'Average US household wastes 30-40% of food — $1,500+/year. Meal planning and proper storage can cut waste by 50%. Food waste is the #1 component in landfills.'
}

export default calcDef

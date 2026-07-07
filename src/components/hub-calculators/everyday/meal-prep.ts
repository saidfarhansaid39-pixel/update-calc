import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mealsPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), servingsPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), prepHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerServing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'mealsPerWeek', label: 'Meals per Week', type: 'number', min: 1, step: '1' },
    { name: 'servingsPerMeal', label: 'Servings per Meal', type: 'number', min: 1, step: '1' },
    { name: 'prepHours', label: 'Prep Hours per Session', type: 'number', min: 0.5, step: '0.5' },
    { name: 'costPerServing', label: 'Cost per Serving ($)', type: 'number', min: 0.5, step: '0.5' },
  ],
  compute: (v) => {
    const totalServings = v.mealsPerWeek * v.servingsPerMeal
    const weeklyCost = totalServings * v.costPerServing
    const monthlyCost = weeklyCost * 4.33
    const timePerServing = (v.prepHours * 60) / totalServings
    const savingsVsEating = weeklyCost * 0.5
    return { result: weeklyCost, label: 'Weekly Cost', unit: '$', steps: [{ label: 'Total Servings', value: `${totalServings}` }, { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Time per Serving', value: `${timePerServing.toFixed(1)} min` }, { label: 'Estimated Savings vs Eating Out', value: `$${savingsVsEating.toFixed(2)}` }] }
  },
  description: 'Calculate meal prep costs, time investment, and potential savings compared to eating out or takeout.',
  formula: 'WeeklyCost = Meals × Servings × Cost/Serving | Time/Serving = TotalMin / TotalServings',
  interpretation: 'Meal prep saves 30-50% vs eating out. Average cost per serving: $2-4 (home cooked) vs $8-15 (takeout). Batch cooking 2-3 hours saves 8+ hours weekly.'
}

export default calcDef

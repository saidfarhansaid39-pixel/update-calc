import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ampDaysPrep: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ampMealsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ampAvgMealCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ampPrepHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ampHourlyWage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ampServingsPerRecipe: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'ampDaysPrep', label: 'Days Covered by Prep', type: 'number', min: 1, max: 14, step: '1' },
    { name: 'ampMealsPerDay', label: 'Meals per Day', type: 'number', min: 1, step: '1' },
    { name: 'ampAvgMealCost', label: 'Average Cost per Home Meal ($)', type: 'number', min: 1, step: '1' },
    { name: 'ampPrepHours', label: 'Prep Time per Session (hours)', type: 'number', min: 0, step: '0.5' },
    { name: 'ampHourlyWage', label: 'Your Hourly Value ($/hr)', type: 'number', min: 0, step: '5' },
    { name: 'ampServingsPerRecipe', label: 'Servings per Recipe', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalMeals = v.ampMealsPerDay * v.ampDaysPrep
    const recipesNeeded = Math.ceil(totalMeals / v.ampServingsPerRecipe)
    const mealCostTotal = totalMeals * v.ampAvgMealCost
    const vsTakeout = totalMeals * v.ampAvgMealCost * 2.5
    const laborCost = v.ampPrepHours * v.ampHourlyWage
    const totalWithLabor = mealCostTotal + laborCost
    const savings = vsTakeout - totalWithLabor
    const costPerMealWithLabor = totalWithLabor / totalMeals
    return { result: costPerMealWithLabor, label: 'Cost per Meal (incl prep time)', unit: '$', steps: [{ label: 'Total Meals', value: `${totalMeals}` }, { label: 'Recipes Needed', value: `${recipesNeeded}` }, { label: 'Food Cost', value: `$${mealCostTotal.toFixed(2)}` }, { label: 'Labor (prep time)', value: `$${laborCost.toFixed(2)}` }, { label: 'Cost per Meal', value: `$${costPerMealWithLabor.toFixed(2)}` }, { label: 'vs Takeout Total', value: `$${vsTakeout.toFixed(2)}` }, { label: 'Savings vs Takeout', value: `$${savings.toFixed(2)}` }] }
  },
  description: 'Auto meal prep calculator that determines cost per meal including food cost and prep time. Compare home-cooked meal prep against takeout to see your real savings.',
  formula: 'Cost/Meal = (Meals × Cost/Meal + Prep Hours × Hourly Wage) / Meals | Savings = Takeout Cost - Total with Labor',
  interpretation: 'Meal prep saves 50-70% vs takeout. Batch cooking 4 servings per recipe minimizes effort. A 3-hr Sunday prep session saves 5+ hours of cooking during the week. Factor in your time at a reasonable hourly rate for true cost comparison.'
}

export default calcDef

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
  defaults: { ampDaysPrep: '5', ampMealsPerDay: '3', ampAvgMealCost: '4', ampPrepHours: '2', ampHourlyWage: '25', ampServingsPerRecipe: '4' },
  presets: [
    { label: 'Workweek Prep', values: { ampDaysPrep: '5', ampMealsPerDay: '3', ampAvgMealCost: '3.5', ampPrepHours: '2', ampHourlyWage: '30', ampServingsPerRecipe: '4' } },
    { label: 'Budget Student', values: { ampDaysPrep: '7', ampMealsPerDay: '3', ampAvgMealCost: '2.5', ampPrepHours: '1.5', ampHourlyWage: '15', ampServingsPerRecipe: '6' } },
    { label: 'Family Batch Cook', values: { ampDaysPrep: '4', ampMealsPerDay: '4', ampAvgMealCost: '5', ampPrepHours: '3', ampHourlyWage: '25', ampServingsPerRecipe: '6' } },
    { label: 'Gym Meal Prep', values: { ampDaysPrep: '6', ampMealsPerDay: '4', ampAvgMealCost: '5.5', ampPrepHours: '2.5', ampHourlyWage: '20', ampServingsPerRecipe: '4' } },
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
    const foodPct = (mealCostTotal / totalWithLabor) * 100
    const laborPct = (laborCost / totalWithLabor) * 100
    const timePerMeal = (v.ampPrepHours * 60) / totalMeals
    return { result: costPerMealWithLabor, label: 'Cost per Meal (incl prep time)', unit: '$', steps: [{ label: 'Total Meals Needed', value: `${v.ampMealsPerDay} × ${v.ampDaysPrep} days = ${totalMeals}` }, { label: 'Recipes to Cook', value: `${totalMeals} / ${v.ampServingsPerRecipe} serv = ${recipesNeeded}` }, { label: 'Total Food Cost', value: `${totalMeals} × $${v.ampAvgMealCost.toFixed(2)} = $${mealCostTotal.toFixed(2)}` }, { label: 'Labor Cost (prep)', value: `${v.ampPrepHours} hrs × $${v.ampHourlyWage.toFixed(2)}/hr = $${laborCost.toFixed(2)}` }, { label: 'Total (food + labor)', value: `$${mealCostTotal.toFixed(2)} + $${laborCost.toFixed(2)} = $${totalWithLabor.toFixed(2)}` }, { label: 'Cost per Meal', value: `$${totalWithLabor.toFixed(2)} / ${totalMeals} = $${costPerMealWithLabor.toFixed(2)}` }, { label: 'Takeout Equivalent', value: `${totalMeals} × ~$${(v.ampAvgMealCost * 2.5).toFixed(1)} = $${vsTakeout.toFixed(2)}` }, { label: 'Net Savings vs Takeout', value: `$${vsTakeout.toFixed(2)} − $${totalWithLabor.toFixed(2)} = $${savings.toFixed(2)}` }] ,
    extras: [
      { label: 'True Cost Breakdown', value: `Food: $${mealCostTotal.toFixed(2)} (${foodPct.toFixed(0)}%) | Labor: $${laborCost.toFixed(2)} (${laborPct.toFixed(0)}%) | Per meal: $${costPerMealWithLabor.toFixed(2)} (food: $${(mealCostTotal / totalMeals).toFixed(2)} + labor: $${(laborCost / totalMeals).toFixed(2)})` },
      { label: 'Savings vs Takeout', value: `Takeout would cost $${vsTakeout.toFixed(2)} for ${totalMeals} meals. Home prep costs $${totalWithLabor.toFixed(2)} including your time. Net savings: $${savings.toFixed(2)} — that is $${(savings / v.ampDaysPrep).toFixed(2)}/day or $${(savings / totalMeals).toFixed(2)}/meal.` },
      { label: 'Time Efficiency', value: `${v.ampPrepHours} hours of prep covers ${v.ampDaysPrep} days of cooking. That is ${timePerMeal.toFixed(0)} min/meal vs 20-40 min cooking from scratch each day. Total time saved: ${((20 * totalMeals / 60) - v.ampPrepHours).toFixed(1)} hours over ${v.ampDaysPrep} days.` },
      { label: 'Recipe Scaling Strategy', value: `${recipesNeeded} recipes × ${v.ampServingsPerRecipe} servings each. Doubling a recipe typically increases cost by only 60% (shared ingredients like spices, oil). Try cooking 1-2 recipes at 2× scale to reduce effort and cost per serving.` },
      { label: 'Is Your Time Worth It?', value: `At $${v.ampHourlyWage.toFixed(0)}/hr, your prep labor adds $${(laborCost / totalMeals).toFixed(2)}/meal. If you earn $${v.ampHourlyWage.toFixed(0)}/hr, that ${(laborCost / totalMeals).toFixed(2)} minutes of prep could have earned $${(v.ampHourlyWage / 60 * timePerMeal).toFixed(2)}. But vs takeout, you still save $${(savings / totalMeals).toFixed(2)}/meal.` },
      { label: 'Container Investment', value: `For ${totalMeals} meals, you need ~${recipesNeeded} containers ($2-4 each for glass, $1-2 for plastic). Glass containers ($${(recipesNeeded * 3).toFixed(0)} total) last 5+ years — $${((recipesNeeded * 3) / (5 * 52 * v.ampDaysPrep / 7)).toFixed(2)}/use vs plastic that warps and stains.` },
      { label: 'Meal Prep Variety Hack', value: 'Cook 1 protein (chicken/beans) + 1 grain (rice/quinoa) + 2 veg (roasted broccoli + salad). Mix and match for 4 different meal combos. This variety covers ' + `${v.ampDaysPrep}` + ' days without boredom — a common meal prep failure.' },
    ]}
  },
  description: 'Calculate the true cost per meal of meal prep including ingredients AND prep time valued at your hourly rate. Compare against takeout to see your real savings, and learn recipe scaling and time efficiency strategies.',
  formula: 'Cost/Meal = (Total Meals × Cost/Meal + Prep Hours × Hourly Wage) ÷ Total Meals | Savings = (Total Meals × Cost/Meal × 2.5) − Total Cost | Recipes Needed = Ceil(Total Meals ÷ Servings/Recipe)',
  interpretation: 'Meal prep saves 50-70% vs takeout even after factoring in prep time at $25/hr. A 5-day workweek prep (15 meals, $4/meal, 2 hours prep at $25/hr) costs $6.33/meal vs $15 takeout — saving $130/week. Batch cooking 4-6 servings per recipe minimizes effort; doubling recipes reduces per-meal cost by 20%. A 2-hour Sunday session saves 5+ hours of daily cooking during the week. The time savings alone (1-2 hours/day not cooking) often justifies meal prep beyond the dollar savings.'
}

export default calcDef

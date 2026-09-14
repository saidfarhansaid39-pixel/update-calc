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
  defaults: { tvcTakeoutMeals: '4', tvcTakeoutCost: '18', tvcCookMeals: '10', tvcCookCostPer: '5', tvcCookTimeMin: '30' },
  presets: [
    { label: 'Busy Professional (5 takeout/wk)', values: { tvcTakeoutMeals: '5', tvcTakeoutCost: '20', tvcCookMeals: '16', tvcCookCostPer: '6', tvcCookTimeMin: '25' } },
    { label: 'Family of 4', values: { tvcTakeoutMeals: '3', tvcTakeoutCost: '50', tvcCookMeals: '18', tvcCookCostPer: '12', tvcCookTimeMin: '45' } },
    { label: 'College Student', values: { tvcTakeoutMeals: '8', tvcTakeoutCost: '12', tvcCookMeals: '12', tvcCookCostPer: '3', tvcCookTimeMin: '15' } },
    { label: 'Health-Conscious Couple', values: { tvcTakeoutMeals: '1', tvcTakeoutCost: '25', tvcCookMeals: '13', tvcCookCostPer: '6', tvcCookTimeMin: '40' } },
  ],
  compute: (v) => {
    const weeklyTakeout = v.tvcTakeoutMeals * v.tvcTakeoutCost
    const weeklyCook = v.tvcCookMeals * v.tvcCookCostPer
    const totalWeekly = weeklyTakeout + weeklyCook
    const monthlyTotal = totalWeekly * 4.33
    const annualTotal = totalWeekly * 52
    const weeklyCookTime = v.tvcCookMeals * v.tvcCookTimeMin
    return { result: totalWeekly, label: 'Total Weekly Food Cost', unit: '$', steps: [
      { label: 'Formula', value: 'Weekly = (Takeout Meals × Cost) + (Cooked Meals × Cost). Annual = Weekly × 52' },
      { label: 'Takeout Cost', value: v.tvcTakeoutMeals + ' meals × $' + v.tvcTakeoutCost.toFixed(2) + ' = $' + weeklyTakeout.toFixed(2) },
      { label: 'Home-Cooked Cost', value: v.tvcCookMeals + ' meals × $' + v.tvcCookCostPer.toFixed(2) + ' = $' + weeklyCook.toFixed(2) },
      { label: 'Weekly Total', value: '$' + weeklyTakeout.toFixed(2) + ' + $' + weeklyCook.toFixed(2) + ' = $' + totalWeekly.toFixed(2) },
      { label: 'Monthly', value: '$' + totalWeekly.toFixed(2) + ' × 4.33 = $' + monthlyTotal.toFixed(2) },
      { label: 'Annual', value: '$' + totalWeekly.toFixed(2) + ' × 52 = $' + annualTotal.toFixed(2) },
      { label: 'Cooking Time/Week', value: weeklyCookTime + ' min (' + (weeklyCookTime / 60).toFixed(1) + ' hrs)' },
      { label: 'If All Takeout', value: 'Would cost $' + ((v.tvcTakeoutMeals + v.tvcCookMeals) * v.tvcTakeoutCost).toFixed(2) + '/wk (saving $' + (Math.max(0, (v.tvcTakeoutMeals + v.tvcCookMeals) * v.tvcTakeoutCost - totalWeekly)).toFixed(2) + '/wk)' },
    ] ,
    extras: [
      { label: 'Savings Potential', value: 'Home cooking saves 60-75% per meal. A $20 takeout meal costs $5-7 to make at home. 5 meals/week = $3,250-3,900 saved per year' },
      { label: 'Time Cost Analysis', value: 'Cooking 30 min + cleanup 10 min = 40 min vs 5 min ordering + 25 min delivery = 30 min. Time savings of takeout is only ~10 min/meal' },
      { label: 'Meal Prep Strategy', value: 'One Sunday meal prep session (2-3 hrs) yields 8-12 meals. Effective cost: $4/meal. Effective time: ~15 min/meal including prep day' },
      { label: 'Batch Cooking', value: 'Cook once, eat twice. Double recipes and freeze half. A $12 batch of chili yields 6 servings = $2/serving vs $8-10 for takeout soup' },
      { label: 'Ingredient Cost Drivers', value: 'Protein (30-40% of cost), produce (20-25%), pantry staples (15-20%), dairy (10-15%). Buy protein in bulk and freeze portions' },
      { label: 'Delivery App Fees', value: 'DoorDash/Uber Eats markup 15-30% on menu prices + delivery fee ($2-6) + service fee (10-15%) + tip. That $15 meal costs $25-30' },
      { label: 'Health Impact', value: 'Home-cooked meals average 500-700 cal vs takeout 1,000-1,500 cal. Home cooking correlates with lower BMI, lower sodium intake, and better nutrition' },
      { label: 'Grocery Strategy', value: 'Use a grocery list and stick to it. Avoid shopping hungry. Buy seasonal produce (30-50% cheaper). Store brands = 20-30% less than name brands' },
    ]}
  },
  description: 'Compare the true cost of takeout versus home-cooked meals including weekly, monthly, and annual spending projections. See how much you could save by cooking more meals at home.',
  formula: 'Weekly Food Cost = (Takeout Meals × Takeout Cost) + (Home-Cooked Meals × Home-Cooked Cost). Monthly = Weekly × 4.33. Annual = Weekly × 52. Cooking Time = Home-Cooked Meals × Time per Meal.',
  interpretation: 'A busy professional eating 5 takeout meals/week at $20/meal and cooking 16 meals at $6/meal spends $196/week on food ($10,192/year) and spends 6.7 hrs/week cooking. Switching 2 takeout meals to cooking saves $28/week ($1,456/year). Over a decade, that\'s $14,560 — enough for a car. Home cooking also provides healthier ingredients, portion control, and a valuable life skill.'
}

export default calcDef

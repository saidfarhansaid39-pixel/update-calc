import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mealsPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), caloriesPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), people: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'mealsPerWeek', label: 'Fast Food Meals/Week', type: 'number', min: 1, step: '1' },
    { name: 'costPerMeal', label: 'Cost per Meal ($)', type: 'number', min: 1, step: '2' },
    { name: 'caloriesPerMeal', label: 'Calories per Meal', type: 'number', min: 200, step: '100' },
    { name: 'people', label: 'Number of People', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const weeklyCost = v.mealsPerWeek * v.costPerMeal * v.people
    const monthlyCost = weeklyCost * 4.33
    const annualCost = weeklyCost * 52
    const weeklyCalories = v.mealsPerWeek * v.caloriesPerMeal * v.people
    const dailyAvgCal = weeklyCalories / 7
    const pctDailyIntake = (dailyAvgCal / 2000) * 100
    return { result: monthlyCost, label: 'Monthly Fast Food Spend', unit: '$', steps: [{ label: 'Weekly Cost', value: `$${weeklyCost.toFixed(0)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(0)}` }, { label: 'Annual Cost', value: `$${annualCost.toFixed(0)}` }, { label: 'Daily Calorie Impact', value: `${dailyAvgCal.toFixed(0)} cal (${pctDailyIntake.toFixed(0)}% of 2000 cal diet)` }] }
  },
  description: 'Track fast food spending and calorie intake. See the financial and nutritional impact of your fast food habits over time.',
  formula: 'Cost = Meals/Week × Cost/Meal × People × 52 | Daily Calories = Meals × Cal/Meal / 7',
  interpretation: 'Average fast food meal: $8-15 with 800-1500 calories. The typical American spends $1,200-2,400/yr on fast food. One fast food meal can contain 60-100% of daily recommended sodium and saturated fat.'
}

export default calcDef

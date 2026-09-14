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
  defaults: { mealsPerWeek: '7', servingsPerMeal: '2', prepHours: '2', costPerServing: '3' },
  presets: [
    { label: 'Single Person (budget)', values: { mealsPerWeek: '7', servingsPerMeal: '1', prepHours: '1.5', costPerServing: '2.50' } },
    { label: 'Family of 4', values: { mealsPerWeek: '7', servingsPerMeal: '4', prepHours: '3', costPerServing: '3.50' } },
    { label: 'Lunch Only Meal Prep', values: { mealsPerWeek: '5', servingsPerMeal: '1', prepHours: '1', costPerServing: '3' } },
    { label: 'Bulk Batch Cooking', values: { mealsPerWeek: '14', servingsPerMeal: '4', prepHours: '4', costPerServing: '2' } },
  ],
  compute: (v) => {
    const totalServings = v.mealsPerWeek * v.servingsPerMeal
    const weeklyCost = totalServings * v.costPerServing
    const monthlyCost = weeklyCost * 4.33
    const timePerServing = (v.prepHours * 60) / totalServings
    const estimatedTakeoutCost = totalServings * 12
    const weeklySavings = estimatedTakeoutCost - weeklyCost
    const annualSavings = weeklySavings * 52
    const costPerMeal = weeklyCost / v.mealsPerWeek
    const minutesPerDay = (v.prepHours * 60) / 7
    return { result: weeklyCost, label: 'Weekly Meal Prep Cost', unit: '$', steps: [
      { label: 'Meals per Week', value: `${v.mealsPerWeek} meals` },
      { label: 'Servings per Meal', value: `${v.servingsPerMeal} servings` },
      { label: 'Total Servings per Week', value: `${v.mealsPerWeek} × ${v.servingsPerMeal} = ${totalServings} servings` },
      { label: 'Cost per Serving', value: `$${v.costPerServing.toFixed(2)}` },
      { label: 'Weekly Total Cost', value: `${totalServings} × $${v.costPerServing.toFixed(2)} = $${weeklyCost.toFixed(2)}` },
      { label: 'Time per Serving', value: `${(v.prepHours * 60)} min / ${totalServings} = ${timePerServing.toFixed(1)} min` },
      { label: 'Cost vs Takeout', value: `Takeout: ~$${estimatedTakeoutCost.toFixed(0)} | Prep: $${weeklyCost.toFixed(2)} | Save: -$${weeklySavings.toFixed(0)}/wk` },
      { label: 'Annual Savings', value: `~$${annualSavings.toFixed(0)}/year by meal prepping vs eating out` },
    ] ,
    extras: [
      { label: 'Cost Comparison', value: `Home-cooked: $${v.costPerServing.toFixed(2)}/serving vs Takeout: $10-15/serving. You save ~ $${weeklySavings.toFixed(0)}/week by prepping — that is $${annualSavings.toFixed(0)}/year.` },
      { label: 'Time Efficiency', value: `You spend ${v.prepHours} hrs/week on prep (${timePerServing.toFixed(1)} min/serving). Cooking daily would take ~${(v.mealsPerWeek * 0.5).toFixed(0)} hrs/week — prep saves ${((v.mealsPerWeek * 0.5) - v.prepHours).toFixed(1)} hrs weekly.` },
      { label: 'Daily Time Commitment', value: `~${minutesPerDay.toFixed(0)} min/day averaged across the week. Prep on Sunday (${v.prepHours} hrs) and enjoy ready meals all week.` },
      { label: 'Best Batch Recipes', value: 'Chili, stir-fry, grain bowls, soups, casseroles, and roasted veggies — these reheat well and scale easily for batch cooking.' },
      { label: 'Storage Tips', value: 'Glass containers (BPA-free) last longer than plastic. Label with date and contents. Soups/stews: 5-7 days in fridge. Cooked grains: 5-7 days. Cooked meat: 3-4 days.' },
      { label: 'Freezer Strategy', value: 'Double your batch and freeze half. Most meals freeze 2-3 months. Thaw overnight in fridge. Soups, stews, and sauces freeze best.' },
    ]}
  },
  description: 'Calculate meal prep costs, time investment, and savings compared to eating out. See the complete breakdown: weekly and monthly costs, time per serving, and annual savings from batch cooking.',
  formula: 'WeeklyCost = Meals × Servings × CostPerServing | TimePerServing = PrepHours × 60 / (Meals × Servings) | AnnualSavings = (TakeoutCost − PrepCost) × 52 | Takeout estimate: $12/serving average',
  interpretation: 'Meal prep saves 30-50% compared to eating out. Average home-cooked cost: $2-5 per serving vs $10-15 for takeout. For a single person prepping 7 meals with 2 servings each ($3/serving): weekly cost = $42, takeout equivalent = ~$168, saving ~$126/week or ~$6,552/year. Investing 2-3 hours on Sunday saves 8+ hours of daily cooking during the week. Best for: batch-friendly recipes like chili, stir-fry, grain bowls, soups, and roasted vegetables.'
}

export default calcDef

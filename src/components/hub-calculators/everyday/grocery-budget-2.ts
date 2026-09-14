import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ householdSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeklySpend: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), eatingOutPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'householdSize', label: 'Household Size', type: 'number', min: 1, step: '1' },
    { name: 'weeklySpend', label: 'Weekly Grocery Spend ($)', type: 'number', min: 10, step: '20' },
    { name: 'eatingOutPct', label: 'Budget for Eating Out (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  defaults: { householdSize: '2', weeklySpend: '120', eatingOutPct: '10' },
  presets: [
    { label: 'Single Person', values: { householdSize: '1', weeklySpend: '60', eatingOutPct: '15' } },
    { label: 'Couple (meal prep)', values: { householdSize: '2', weeklySpend: '100', eatingOutPct: '5' } },
    { label: 'Family of 4', values: { householdSize: '4', weeklySpend: '200', eatingOutPct: '10' } },
    { label: 'Large Family', values: { householdSize: '6', weeklySpend: '300', eatingOutPct: '5' } },
  ],
  compute: (v) => {
    const monthlyGroceries = v.weeklySpend * 4.33
    const perPersonWeekly = v.weeklySpend / v.householdSize
    const perPersonMonthly = monthlyGroceries / v.householdSize
    const eatingOut = monthlyGroceries * (v.eatingOutPct / 100)
    const totalFood = monthlyGroceries + eatingOut
    const annualGroceries = monthlyGroceries * 12
    const annualEatingOut = eatingOut * 12
    const annualTotal = totalFood * 12
    const pctIncome = annualTotal / 60000 * 100
    const eatingOutCostPerMeal = eatingOut > 0 ? eatingOut / (v.householdSize * 7 * (v.eatingOutPct / 100) * 4.33 / 3) : 0
    return { result: monthlyGroceries, label: 'Monthly Grocery Budget', unit: '$', steps: [{ label: 'Household Size', value: `${v.householdSize} people` }, { label: 'Weekly Grocery Spend', value: `$${v.weeklySpend.toFixed(2)}` }, { label: 'Monthly Groceries (4.33 wk)', value: `$${monthlyGroceries.toFixed(2)}` }, { label: 'Eating Out Budget', value: `$${eatingOut.toFixed(2)}/mo (${v.eatingOutPct}% of groceries)` }, { label: 'Total Monthly Food Cost', value: `$${totalFood.toFixed(2)}` }, { label: 'Per Person per Week', value: `$${perPersonWeekly.toFixed(2)}` }, { label: 'Per Person per Month', value: `$${perPersonMonthly.toFixed(2)}` }, { label: '% of $60k Income', value: `${pctIncome.toFixed(1)}%` }] ,
    extras: [
      { label: 'USDA Food Plan Comparison', value: `USDA 2024 thrifty plan: $50-60/person/week. Low-cost: $65-80. Moderate: $80-100. Liberal: $100-130+. Your $${perPersonWeekly.toFixed(2)}/person/week = ${perPersonWeekly >= 100 ? 'liberal' : perPersonWeekly >= 80 ? 'moderate' : perPersonWeekly >= 65 ? 'low-cost' : 'thrifty'} level. A family of ${v.householdSize} at moderate plan: $${(v.householdSize * 90).toFixed(0)}/wk — your $${v.weeklySpend.toFixed(0)}/wk is ${v.weeklySpend < v.householdSize * 90 ? 'below' : 'above'} moderate.` },
      { label: 'Eating Out vs Home Cooking Cost Gap', value: `Eating out costs 2-4× more than home cooking. Average restaurant meal: $15-25/person vs home-cooked: $4-8/person. Your ${v.eatingOutPct}% eating out budget = $${eatingOut.toFixed(2)}/mo. If you cooked all meals at home (average), you'd save ~$${(eatingOut * 0.6).toFixed(0)}/mo. But quality of life matters — a balanced approach: cook 5-6 nights, eat out/takeout 1-2 nights.` },
      { label: 'Weekly vs Monthly Budget Tracking', value: `Using 4.33 weeks/month: $${monthlyGroceries.toFixed(2)}/mo. Actual months vary (4 or 5 weeks). Budget $${(v.weeklySpend * 4.33).toFixed(0)}/mo but track weekly. If you overspend one week ($${(v.weeklySpend * 1.2).toFixed(0)}), cut back next week to $${(v.weeklySpend * 0.8).toFixed(0)}. The 4.33 factor smooths out 5-week months. Annual: $${annualGroceries.toFixed(0)} on groceries + $${annualEatingOut.toFixed(0)} on eating out.` },
      { label: 'Grocery Saving Strategies', value: `Shop with a list: reduces impulse buys 20-30%. Buy store brands: save 15-25% vs name brands. Use loyalty apps: 5-15% back in rewards. Buy in bulk for non-perishables: save 10-30%. Seasonal produce: 20-40% cheaper than out-of-season. Meal plan before shopping: reduces waste 25-50%. Your $${v.weeklySpend.toFixed(0)}/wk could be $${(v.weeklySpend * 0.8).toFixed(0)} with all strategies = save $${(v.weeklySpend * 0.2 * 52).toFixed(0)}/yr.` },
      { label: 'Dietary Pattern Cost Impact', value: `Standard omnivore: $${perPersonWeekly.toFixed(2)}/person/week. Vegetarian: ~15-20% cheaper (no meat cost). Vegan: ~20-25% cheaper. Keto/high-protein: ~20-30% more expensive (meat, eggs, cheese). Organic: 30-50% more. Gluten-free: 20-30% more. If your family follows a special diet, adjust your budget: your $${perPersonWeekly.toFixed(2)}/person/week may run $${(perPersonWeekly * 1.25).toFixed(2)}-$${(perPersonWeekly * 1.5).toFixed(2)} for premium diets.` },
      { label: 'Food Waste Reduction Savings', value: `Average US household wastes $1,500-2,000/yr in food. Your $${monthlyGroceries.toFixed(0)}/mo: waste ~25% = $${(monthlyGroceries * 0.25).toFixed(0)}/mo wasted. Reduce by: meal planning (cuts waste 50%), proper storage (extends shelf life 3-7 days), using leftovers (save $50-100/mo), composting scraps. Cutting waste from 25% to 10% saves $${(monthlyGroceries * 0.15).toFixed(0)}/mo = $${(monthlyGroceries * 0.15 * 12).toFixed(0)}/yr.` },
      { label: 'Inflation & Price Changes', value: `Food inflation averaged 5-8%/yr recently. Your $${v.weeklySpend.toFixed(0)}/wk budget will need to be $${(v.weeklySpend * 1.06).toFixed(0)} next year just to buy the same items. Over 3 years: $${(v.weeklySpend * Math.pow(1.06, 3)).toFixed(0)}/wk. Lock in prices by buying shelf-stable items in bulk when on sale. Stock up on non-perishables when prices dip 20-30% below average.` },
      { label: 'Per-Person Budget by Age & Gender', value: `USDA: adult male (19-50): $75-135/wk. Adult female (19-50): $65-115/wk. Teen boy: $80-140/wk. Teen girl: $65-115/wk. Child (6-11): $55-90/wk. Child (2-5): $35-60/wk. Your household of ${v.householdSize}: adjust your $${perPersonWeekly.toFixed(2)}/person based on who's eating. Teen boys cost 2× more than young children in grocery budgets.` },
    ]}
  },
  description: 'Plan your household food budget with weekly grocery spend, household size, and eating out percentage. Compare to USDA thrifty-to-liberal food plans, track per-person costs, estimate annual totals, and discover savings strategies through meal planning, waste reduction, and bulk buying.',
  formula: 'Monthly Groceries = Weekly × 4.33 | Per Person/Week = Weekly ÷ Household Size | Eating Out Budget = Monthly Groceries × (Eating Out % ÷ 100) | Total Food = Groceries + Eating Out | % Income = (Annual Total ÷ Income) × 100',
  interpretation: 'USDA moderate plan: $80-100/person/week for groceries. Eating out costs 2-4× more than home cooking. Budget 10-15% of income for total food. Food waste averages 25% of grocery spend. Shopping with a list cuts impulse buys 20-30%. Store brands save 15-25%. Using the 4.33 weekly multiplier smooths varying month lengths. Adjust budgets based on dietary patterns: vegetarian saves ~20%, keto adds ~25%.'
}

export default calcDef

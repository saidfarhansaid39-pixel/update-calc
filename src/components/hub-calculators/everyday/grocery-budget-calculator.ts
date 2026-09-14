import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ numPeople: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeklyBudgetPerPerson: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), includeNonFood: z.string().min(1) }),
  fields: [
    { name: 'numPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'weeklyBudgetPerPerson', label: 'Budget per Person per Week ($)', type: 'number', min: 10, step: '10' },
    { name: 'includeNonFood', label: 'Include Non-Food Items', type: 'select', options: [{ label: 'Yes (add 15%)', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { numPeople: '2', weeklyBudgetPerPerson: '60', includeNonFood: 'yes' },
  presets: [
    { label: 'College Student', values: { numPeople: '1', weeklyBudgetPerPerson: '45', includeNonFood: 'no' } },
    { label: 'Young Couple', values: { numPeople: '2', weeklyBudgetPerPerson: '60', includeNonFood: 'yes' } },
    { label: 'Family (2 adults + 2 kids)', values: { numPeople: '4', weeklyBudgetPerPerson: '55', includeNonFood: 'yes' } },
    { label: 'Premium / Organic Diet', values: { numPeople: '2', weeklyBudgetPerPerson: '90', includeNonFood: 'yes' } },
  ],
  compute: (v) => {
    const weeklyFood = v.numPeople * v.weeklyBudgetPerPerson
    const nonFoodMultiplier = v.includeNonFood === 'yes' ? 1.15 : 1
    const weeklyTotal = weeklyFood * nonFoodMultiplier
    const monthlyTotal = weeklyTotal * 4.33
    const annualTotal = weeklyTotal * 52
    const nonFoodAmount = weeklyTotal - weeklyFood
    const nonFoodAnnual = nonFoodAmount * 52
    const perPersonDaily = v.weeklyBudgetPerPerson / 7
    const perPersonMonthly = v.weeklyBudgetPerPerson * 4.33
    const pctIncome = annualTotal / 60000 * 100
    return { result: monthlyTotal, label: 'Monthly Grocery Budget', unit: '$', steps: [{ label: 'Household Size', value: `${v.numPeople} people` }, { label: 'Food per Person/Week', value: `$${v.weeklyBudgetPerPerson.toFixed(2)}` }, { label: 'Weekly Food Total', value: `$${weeklyFood.toFixed(2)}` }, { label: 'Non-Food Items (15%)', value: v.includeNonFood === 'yes' ? `+$${nonFoodAmount.toFixed(2)}/wk` : `$0 (excluded)` }, { label: 'Weekly Grand Total', value: `$${weeklyTotal.toFixed(2)}` }, { label: 'Monthly Total (4.33 wk)', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }, { label: '% of $60k Income', value: `${pctIncome.toFixed(1)}%` }] ,
    extras: [
      { label: 'Non-Food Essentials Breakdown', value: `${v.includeNonFood === 'yes' ? 'Non-food adds 15% ($' + nonFoodAmount.toFixed(2) + '/wk, $' + nonFoodAnnual.toFixed(0) + '/yr): paper products (paper towels, toilet paper) ~$8-15/wk, cleaning supplies ~$5-10/wk, personal care (soap, toothpaste, etc.) ~$5-10/wk, trash bags, foil, etc. ~$3-5/wk.' : 'By excluding non-food ($0 added), you\'re estimating food-only. Add 10-20% for paper products ($8-15/wk), cleaning ($5-10/wk), and personal care ($5-10/wk). Tip: budget non-food separately for accurate grocery tracking.'} Non-food items are often better bought at warehouse clubs (Costco/Sam\'s) for 30-50% savings over grocery stores.` },
      { label: 'Per-Person Cost at National Benchmarks', value: `Your $${v.weeklyBudgetPerPerson.toFixed(0)}/person/week = $${perPersonDaily.toFixed(2)}/person/day. USDA thrifty: $6-8/day. Low-cost: $9-11/day. Moderate: $11-14/day. Liberal: $14-19/day. Your budget is ${v.weeklyBudgetPerPerson >= 100 ? 'liberal' : v.weeklyBudgetPerPerson >= 80 ? 'moderate-to-liberal' : v.weeklyBudgetPerPerson >= 65 ? 'low-to-moderate' : v.weeklyBudgetPerPerson >= 50 ? 'thrifty-to-low' : 'below thrifty plan — very tight'}. ${v.weeklyBudgetPerPerson < 50 ? 'Consider bulk buying rice, beans, and seasonal produce to stretch.' : ''}` },
      { label: 'Weekly Meal Planning Guide', value: `$${v.weeklyBudgetPerPerson.toFixed(0)}/person/week = ~$${perPersonDaily.toFixed(2)}/person/day across 3 meals + snacks. Budget allocation: 40% produce ($${(weeklyFood * 0.4).toFixed(0)}), 20% protein ($${(weeklyFood * 0.2).toFixed(0)}), 15% dairy ($${(weeklyFood * 0.15).toFixed(0)}), 15% pantry ($${(weeklyFood * 0.15).toFixed(0)}), 10% snacks/treats ($${(weeklyFood * 0.1).toFixed(0)}). Plan meals around weekly sales flyers — saves 15-25%. Cook once, eat twice: batch cooking cuts time and cost.` },
      { label: 'Shopping Frequency & Impulse Control', value: `Shopping once/week vs 3×/week: reduces impulse buys 20-30%. Your $${weeklyFood.toFixed(0)}/wk trip: stick to a list to avoid the typical $${(weeklyFood * 0.2).toFixed(0)} in unplanned purchases. Online pickup: 15-25% fewer impulse buys vs in-store browsing. Never shop hungry — increases spending 20-30%. Use cash-only for groceries to physically limit spending.` },
      { label: 'Store Choice Impact on Budget', value: `Store choice can change your bill 20-40%. Aldi/Lidl: save 30-50% vs mainstream. Walmart: 15-25% vs traditional grocery. Costco/Sam's (bulk): 20-30% on pantry staples but requires $60-120/yr membership. Local ethnic markets: 20-40% cheaper on produce and spices. Farmers markets: premium prices but fresher, longer-lasting produce reduces waste. Your $${weeklyFood.toFixed(0)}/wk at Aldi = ~$${(weeklyFood * 0.7).toFixed(0)} at mainstream.` },
      { label: 'Coupon & Cashback Optimization', value: `Digital coupons (store apps): 5-15% savings = $${(annualTotal * 0.1).toFixed(0)}/yr. Cashback apps (Ibotta, Fetch, Rakuten): 2-10% on specific items = $${(annualTotal * 0.03).toFixed(0)}-$${(annualTotal * 0.10).toFixed(0)}/yr. Store loyalty programs: exclusive discounts + fuel points (save $0.10-0.50/gal on gas). Cashback credit cards: 2-6% on groceries = $${(annualTotal * 0.04).toFixed(0)}/yr. Combined: up to 20% savings = $${(annualTotal * 0.2).toFixed(0)}/yr.` },
      { label: 'Seasonal & Regional Cost Factors', value: `Seasonal produce (in-season) costs 30-50% less than out-of-season. Winter tomatoes vs summer: 2× price. Regional variation: Northeast +15% vs national avg, South −5%, Midwest −5%, West +10%. Your location: adjust budget accordingly. Growing a small vegetable garden (tomatoes, herbs, peppers) saves $100-300/yr and provides fresher produce 4-6 months/year.` },
      { label: 'Adjusting for Special Diets & Allergies', value: `Special diets increase costs: gluten-free +20-30%, organic +30-50%, keto/high-protein +20-30%, vegan +0-10% (meat savings offset by specialty items). Food allergies: specialty substitutes cost 2-3× more. If your household requires special diets, your $${v.weeklyBudgetPerPerson.toFixed(0)}/person/week effectively buys 20-30% less than a standard diet budget. Shop bulk bins for GF grains, grow herbs, and use frozen produce (same nutrients, 30-50% less).` },
    ]}
  },
  description: 'Build a complete household grocery budget including per-person weekly food spend, non-food essentials (15% adder for paper products, cleaning, personal care), annual projections, and income percentage. Compare to USDA benchmarks, optimize with store choice, meal planning, coupons, and seasonal shopping.',
  formula: 'Weekly Food = People × Budget/Person | Weekly Total = Food × (1 + NonFood%) | Monthly = Weekly × 4.33 | Annual = Weekly × 52 | Non-Food Annual = Weekly Non-Food × 52 | % of Income = (Annual Total ÷ Income) × 100',
  interpretation: 'Non-food items (paper products, cleaning supplies, toiletries) add 10-20% to grocery bills. USDA moderate plan: $80-100/person/week. Store choice changes bill by 20-40% (Aldi 30-50% cheaper). Shopping with a list cuts impulse buys 20-30%. Online pickup reduces unplanned purchases 15-25%. Digital coupons + cashback apps save 10-20%. Meal planning around weekly sales saves 15-25%. Seasonal produce costs 30-50% less than out-of-season.'
}

export default calcDef

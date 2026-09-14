import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mealsPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), people: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), deliveryFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'mealsPerWeek', label: 'Dining Out Meals/Week', type: 'number', min: 1, step: '1' },
    { name: 'costPerMeal', label: 'Avg Cost per Meal ($)', type: 'number', min: 1, step: '5' },
    { name: 'people', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'deliveryFee', label: 'Delivery Fee/Tip ($)', type: 'number', min: 0, step: '2' },
  ],
  defaults: { mealsPerWeek: '4', costPerMeal: '18', people: '2', deliveryFee: '5' },
  presets: [
    { label: 'Single Coffee & Takeout', values: { mealsPerWeek: '3', costPerMeal: '12', people: '1', deliveryFee: '3' } },
    { label: 'Couple Frequent Diners', values: { mealsPerWeek: '5', costPerMeal: '25', people: '2', deliveryFee: '5' } },
    { label: 'Family of 4', values: { mealsPerWeek: '3', costPerMeal: '45', people: '4', deliveryFee: '8' } },
    { label: 'Delivery-Heavy Lifestyle', values: { mealsPerWeek: '7', costPerMeal: '20', people: '1', deliveryFee: '7' } },
  ],
  compute: (v) => {
    const weekly = v.mealsPerWeek * (v.costPerMeal + v.deliveryFee) * v.people
    const monthly = weekly * 4.33
    const annual = weekly * 52
    const homeCookedSavings = weekly * 0.65
    const homeAnnual = annual * 0.35
    const savingsIfReduce2 = monthly - ((v.mealsPerWeek - 2) * (v.costPerMeal + v.deliveryFee) * v.people * 4.33)
    return { result: monthly, label: 'Monthly Dining Budget', unit: '$', steps: [{ label: 'Cost per Meal (incl. fee)', value: `$${(v.costPerMeal + v.deliveryFee).toFixed(2)} × ${v.people} people` }, { label: 'Weekly Dining Spend', value: `$${weekly.toFixed(2)} (${v.mealsPerWeek} meals)` }, { label: 'Monthly Dining Spend', value: `$${monthly.toFixed(2)}` }, { label: 'Annual Dining Spend', value: `$${annual.toFixed(2)}` }, { label: 'If Cooked at Home', value: `~$${homeAnnual.toFixed(0)}/yr (saves ~$${homeCookedSavings.toFixed(0)}/wk)` }, { label: 'Drop 2 Meals/Wk', value: `Saves ~$${savingsIfReduce2.toFixed(0)}/mo ($${(savingsIfReduce2 * 12).toFixed(0)}/yr)` }, { label: 'Daily Average', value: `~$${(monthly / 30).toFixed(2)}/day on dining` }] ,
    extras: [
      { label: "Home Cooking Math", value: "Cooking at home costs 60-70% less than restaurant meals. A $25 restaurant meal costs ~$6-8 to make at home. The average couple saves $3,000-5,000/yr by cutting dining from 5 to 2 meals/week." },
      { label: "Delivery App Fees", value: "DoorDash/Uber Eats add 15-30% markup on menu prices + delivery fee + service fee + tip. A $15 menu item often costs $22-28 delivered. Pickup saves 15-25%." },
      { label: "The Latte Factor", value: "A $6 daily coffee + $15 lunch = $21/day = $7,665/yr. Investing that at 7% return for 30 years grows to ~$725,000. Small recurring spends compound enormously." },
      { label: "Meal Prep Savings", value: "Sunday meal prep of 5 lunches costs $25-40 total ($5-8 each). Buying lunch daily costs $12-18 each. Weekly savings: $35-70. Annual: $1,820-3,640." },
      { label: "Restaurant Markup", value: "Restaurants typically mark up ingredients 250-350%. A pasta dish costing $4 in ingredients sells for $14-18. Beverages have the highest markup: soda costs $0.20, sells for $3 (1,400% markup)." },
      { label: "Subscription Traps", value: "DashPass ($9.99/mo) and Uber One ($9.99/mo) reduce delivery fees but increase order frequency by 30-50%—users spend more overall despite lower per-order fees." },
      { label: "Budgeting Methods", value: "50/30/20 rule: dining out comes from the 30% 'wants' category. If your monthly take-home is $4,000, you should spend no more than $1,200 on all wants combined." },
      { label: "Date Night Alternatives", value: "A $60 restaurant date vs a $20 picnic or $15 cook-it-together meal. Doing the cheaper option 3 of 4 date nights/month saves $1,440-1,800/yr." },
    ]}
  },
  description: 'Calculate your true dining out and delivery spending—including fees, tips, and the full annual impact. Compare against home cooking costs, see how much dropping 2 meals per week saves, and understand the long-term financial cost of recurring restaurant spending.',
  formula: 'Weekly = Meals × (Cost + Delivery Fee) × People | Monthly = Weekly × 4.33 | Annual = Weekly × 52 | Home Savings = Spend × 0.65',
  interpretation: 'The average American household spends $3,500-5,000/year on dining out—and that figure understates delivery riders. When factoring in delivery app markups (15-30%), service fees, and tips, the true cost of a meal purchased through DoorDash or Uber Eats is 40-60% above the menu price. Cooking at home costs 60-70% less per meal, meaning a couple that dines out 4x/week could redirect $3,000-5,000/year toward savings or investments. Reducing dining out by just 2 meals/week saves $1,500-3,000/year per person. The latte factor is real: a $6 daily coffee invested at 7% grows to over $100,000 in 30 years.'
}

export default calcDef

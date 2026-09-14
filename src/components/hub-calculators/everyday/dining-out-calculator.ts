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
  defaults: { mealsPerWeek: '3', costPerMeal: '20', people: '2', deliveryFee: '5' },
  presets: [
    { label: 'Frequent Delivery (Single)', values: { mealsPerWeek: '5', costPerMeal: '25', people: '1', deliveryFee: '8' } },
    { label: 'Date Night Couple', values: { mealsPerWeek: '2', costPerMeal: '60', people: '2', deliveryFee: '10' } },
    { label: 'Family Takeout Habit', values: { mealsPerWeek: '4', costPerMeal: '15', people: '4', deliveryFee: '3' } },
    { label: 'Brown-Bag Hero', values: { mealsPerWeek: '1', costPerMeal: '12', people: '1', deliveryFee: '0' } },
  ],
  compute: (v) => {
    const weekly = v.mealsPerWeek * (v.costPerMeal + v.deliveryFee) * v.people
    const monthly = weekly * 4.33
    const annual = weekly * 52
    const perPersonMonthly = monthly / v.people
    const atHomeCost = monthly * 0.35
    const potentialSavings = monthly - atHomeCost
    const dailyAvg = monthly / 30
    return { result: monthly, label: 'Monthly Dining Out Cost', unit: '$', steps: [
      { label: 'Cost per Outing', value: `($${v.costPerMeal.toFixed(0)} meal + $${v.deliveryFee.toFixed(0)} fee) × ${v.people} people = $${((v.costPerMeal + v.deliveryFee) * v.people).toFixed(2)}` },
      { label: 'Weekly Spend', value: `$${weekly.toFixed(2)}` },
      { label: 'Monthly Spend', value: `$${monthly.toFixed(2)}` },
      { label: 'Annual Spend', value: `$${annual.toFixed(2)}` },
      { label: 'Per Person per Month', value: `$${perPersonMonthly.toFixed(2)}` },
      { label: 'Daily Average', value: `$${dailyAvg.toFixed(2)}` },
      { label: 'Cost If Cooked at Home', value: `~$${atHomeCost.toFixed(2)}/mo` },
      { label: 'Potential Savings (cook more)', value: `$${potentialSavings.toFixed(2)}/mo` },
    ] ,
    extras: [
      { label: "Budget Guideline", value: "The 50/30/20 rule suggests spending no more than 10-15% of after-tax income on dining out. If your monthly dining exceeds $400, review your grocery vs. restaurant balance." },
      { label: "Coffee & Snacks", value: "Latte Factor: a $5 daily coffee + $3 snack adds $240/mo. These small purchases often rival restaurant spending. Include them for a full picture." },
      { label: "Delivery Apps", value: "DoorDash/UberEats mark up menu items 15-25% and add service fees ($2-6). Ordering direct from the restaurant saves 15-30%." },
      { label: "Holiday & Event Surge", value: "December, Valentine's Day, and Mother's Day see 40-60% higher dining spend. Budget $100-300 extra during these months." },
      { label: "Meal Prep Savings", value: "One weekly meal prep session (2 hrs) saves $60-120/mo per person. Batch-cook grains, proteins, and sauces on Sunday." },
      { label: "Happy Hour Hack", value: "Dining at off-peak hours or during happy hour cuts appetizer and drink costs by 30-50%. Same restaurant, half the bill." },
      { label: "Credit Card Rewards", value: "Dining rewards cards (Chase Sapphire, Capital One Savor) earn 3-4× points on restaurants. That's $120-240 back per $6,000 annual spend." },
      { label: "Subscription Fatigue", value: "Meal kit subscriptions (HelloFresh, Blue Apron) average $9-12/serving. Compare against $15-25 restaurant entrees — meal kits are 40% cheaper." },
    ]}
  },
  description: 'Track your true dining out and delivery costs across weekly, monthly, and annual horizons. Compare against cooking at home savings and understand per-person spending patterns with break-even analysis.',
  formula: 'Monthly = Meals/Week × (Avg Cost + Delivery Fee) × People × 4.33 | Savings = Monthly - (Monthly × 0.35)',
  interpretation: 'The average American household spends $3,500-5,000/yr dining out — roughly 5% of income. Cooking at home costs 60-70% less per serving. Cutting just 2 restaurant meals/week saves $3,000-5,000/yr. Strategic changes like limiting delivery apps, using happy hour pricing, and meal prepping on Sundays can cut your dining bill in half without eliminating the social joy of eating out.'
}

export default calcDef

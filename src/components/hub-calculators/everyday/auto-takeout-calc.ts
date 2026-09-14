import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ atoMealsPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), atoAvgCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), atoDeliveryFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), atoTipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), atoPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'atoMealsPerWeek', label: 'Takeout Meals/Week', type: 'number', min: 1, step: '1' },
    { name: 'atoAvgCost', label: 'Avg Cost per Meal ($)', type: 'number', min: 5, step: '5' },
    { name: 'atoDeliveryFee', label: 'Delivery Fee per Order ($)', type: 'number', min: 0, step: '2' },
    { name: 'atoTipPct', label: 'Tip Percentage (%)', type: 'number', min: 0, max: 30, step: '5' },
    { name: 'atoPeople', label: 'People per Order', type: 'number', min: 1, step: '1' },
  ],
  defaults: { atoMealsPerWeek: '3', atoAvgCost: '15', atoDeliveryFee: '4', atoTipPct: '15', atoPeople: '1' },
  presets: [
    { label: 'Single Heavy Orderer', values: { atoMealsPerWeek: '5', atoAvgCost: '18', atoDeliveryFee: '5', atoTipPct: '18', atoPeople: '1' } },
    { label: 'Couple Weekend Takeout', values: { atoMealsPerWeek: '2', atoAvgCost: '35', atoDeliveryFee: '4', atoTipPct: '15', atoPeople: '2' } },
    { label: 'Family Friday Night', values: { atoMealsPerWeek: '4', atoAvgCost: '50', atoDeliveryFee: '6', atoTipPct: '18', atoPeople: '4' } },
    { label: 'Occasional Treat', values: { atoMealsPerWeek: '1', atoAvgCost: '20', atoDeliveryFee: '3', atoTipPct: '20', atoPeople: '1' } },
  ],
  compute: (v) => {
    const baseCost = v.atoMealsPerWeek * v.atoAvgCost
    const deliveryTotal = v.atoMealsPerWeek * v.atoDeliveryFee
    const tipAmount = baseCost * (v.atoTipPct / 100)
    const weeklyTotal = baseCost + deliveryTotal + tipAmount
    const monthlyTotal = weeklyTotal * 4.33
    const annualTotal = weeklyTotal * 52
    return { result: monthlyTotal, label: 'Monthly Takeout Cost', unit: '$', steps: [
      { label: 'Weekly Food Cost', value: `${v.atoMealsPerWeek} meals × $${v.atoAvgCost.toFixed(2)} = $${baseCost.toFixed(2)}` },
      { label: 'Delivery Fees', value: `${v.atoMealsPerWeek} meals × $${v.atoDeliveryFee.toFixed(2)} = $${deliveryTotal.toFixed(2)}` },
      { label: 'Tips', value: `$${baseCost.toFixed(2)} × ${v.atoTipPct}% = $${tipAmount.toFixed(2)}` },
      { label: 'Weekly Total', value: `$${baseCost.toFixed(2)} + $${deliveryTotal.toFixed(2)} + $${tipAmount.toFixed(2)} = $${weeklyTotal.toFixed(2)}` },
      { label: 'Monthly Total (×4.33)', value: `$${weeklyTotal.toFixed(2)} × 4.33 = $${monthlyTotal.toFixed(2)}` },
      { label: 'Annual Total (×52)', value: `$${weeklyTotal.toFixed(2)} × 52 = $${annualTotal.toFixed(2)}` },
      { label: 'Avg per Order', value: `$${weeklyTotal.toFixed(2)} ÷ ${v.atoMealsPerWeek} meals = $${(weeklyTotal / v.atoMealsPerWeek).toFixed(2)}` },
      { label: 'Avg per Person', value: `$${(weeklyTotal / v.atoMealsPerWeek).toFixed(2)} ÷ ${v.atoPeople} = $${(weeklyTotal / v.atoMealsPerWeek / v.atoPeople).toFixed(2)}` },
    ] ,
    extras: [
      { label: "Delivery fee trap", value: "A $4 delivery fee × 5 meals/week = $20/week = $1,040/year on fees alone. Plus tips on the pre-fee total boosts it further. Pickup saves $3–7 per order — that's $500–1,800/year for regular orderers." },
      { label: "Service app markup", value: "DoorDash/Uber Eats mark up menu items 15–25% vs in-store prices. A $15 restaurant meal costs $18–19 on the app before fees and tip. Ordering directly from the restaurant (even for pickup) saves 15–25%." },
      { label: "Tip percentage guide", value: "15% for standard delivery. 18–20% for bad weather or large orders. 20–25% for exceptional service. Note: tips go to the driver, not the restaurant. On a $40 order, 18% = $7.20 — that's the driver's primary income." },
      { label: "Home cooking savings", value: "The same $15 takeout meal costs $4–6 to cook at home (ingredients only). At 5×/week, the difference is $45–55/week = $2,340–2,860/year. Batch cooking Sunday saves 2–3 takeout meals per week." },
      { label: "Monthly subscription meal plans", value: "Meal kit services (HelloFresh, Blue Apron: $8–12/serving) sit between takeout ($15–25) and grocery cooking ($4–6). For 2 people × 5 meals: $80–120/week vs $150–250 takeout. But meal kits generate more packaging waste." },
      { label: "Lunch vs dinner takeout", value: "Lunch takeout is typically $10–15 vs dinner $18–30 for the same cuisine. If you work from home, making lunch saves $8–12/meal. With 20 workdays/month: $160–240 savings on lunch alone." },
      { label: "Drinks on delivery", value: "Adding a $4 soda or $12 cocktail to a delivery order is marked up 200–400%. A $15 meal becomes $19 with a soda. Buying drinks from the grocery store ($0.25–0.50/can) saves $3.50–11.50 per order." },
      { label: "Year-round tracking tip", value: "The average person underestimates takeout spending by 40–60%. Use a spending tracker (Mint, YNAB) for 3 months. The real number is usually shocking: 3×/week at $20 = $3,120/year (without delivery fees). Budget-conscious: cap takeout at $100/month." },
    ]}
  },
  description: 'Calculate your real takeout spending — food cost, delivery fees, and tips across week, month, and year. See average cost per order and per person for any dining habit.',
  formula: 'Weekly = (Meals × AvgCost + Meals × Fee + Food × Tip%) | Monthly = Weekly × 4.33 | Annual = Weekly × 52',
  interpretation: 'A single person getting takeout 5×/week at $18/meal: ~$575/month ($6,900/year). A couple getting takeout 2×/week at $35 total: ~$350/month ($4,200/year). Reducing frequency by just 1 meal/week saves $900–1,500/year. Cooking at home costs 60% less per serving.'
}

export default calcDef

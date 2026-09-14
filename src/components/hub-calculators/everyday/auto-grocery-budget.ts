import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ agbHouseholdSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), agbDietType: z.string().min(1), agbMealsPerDay: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), agbBudgetStrictness: z.string().min(1), agbDeliveryPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'agbHouseholdSize', label: 'Household Size', type: 'number', min: 1, step: '1' },
    { name: 'agbDietType', label: 'Diet Type', type: 'select', options: [{ label: 'Standard', value: 'standard' }, { label: 'Vegetarian', value: 'vegetarian' }, { label: 'Vegan', value: 'vegan' }, { label: 'Keto/Low-Carb', value: 'keto' }, { label: 'Mediterranean', value: 'mediterranean' }] },
    { name: 'agbMealsPerDay', label: 'Meals Cooked at Home per Day', type: 'number', min: 1, max: 5, step: '1' },
    { name: 'agbBudgetStrictness', label: 'Spending Level', type: 'select', options: [{ label: 'Thrifty (lowest cost)', value: 'thrifty' }, { label: 'Moderate (balanced)', value: 'moderate' }, { label: 'Liberal (organic/premium)', value: 'liberal' }] },
    { name: 'agbDeliveryPct', label: 'Delivery/Grocery App (10% surcharge)', type: 'select', options: [{ label: 'Shop in-store (0%)', value: 'none' }, { label: 'Partial delivery (30% of orders)', value: 'partial' }, { label: 'Mostly delivery (70% of orders)', value: 'mostly' }] },
  ],
  defaults: { agbHouseholdSize: '2', agbDietType: 'standard', agbMealsPerDay: '3', agbBudgetStrictness: 'moderate', agbDeliveryPct: 'none' },
  presets: [
    { label: 'Couple Meal Preppers', values: { agbHouseholdSize: '2', agbDietType: 'vegetarian', agbMealsPerDay: '3', agbBudgetStrictness: 'thrifty', agbDeliveryPct: 'none' } },
    { label: 'Family of 4', values: { agbHouseholdSize: '4', agbDietType: 'standard', agbMealsPerDay: '3', agbBudgetStrictness: 'moderate', agbDeliveryPct: 'partial' } },
    { label: 'Keto Single', values: { agbHouseholdSize: '1', agbDietType: 'keto', agbMealsPerDay: '2', agbBudgetStrictness: 'liberal', agbDeliveryPct: 'none' } },
    { label: 'Vegan Family', values: { agbHouseholdSize: '3', agbDietType: 'vegan', agbMealsPerDay: '3', agbBudgetStrictness: 'moderate', agbDeliveryPct: 'mostly' } },
  ],
  compute: (v) => {
    const dietFactors: Record<string, number> = { standard: 1, vegetarian: 0.9, vegan: 0.85, keto: 1.15, mediterranean: 1.05 }
    const strictnessCost: Record<string, number> = { thrifty: 45, moderate: 70, liberal: 100 }
    const deliveryFactors: Record<string, number> = { none: 1, partial: 1.03, mostly: 1.07 }
    const dietFactor = dietFactors[v.agbDietType] || 1
    const basePerPerson = strictnessCost[v.agbBudgetStrictness] || 70
    const deliveryFactor = deliveryFactors[v.agbDeliveryPct] || 1
    const weeklyPerPerson = basePerPerson * dietFactor * deliveryFactor
    const weeklyTotal = weeklyPerPerson * v.agbHouseholdSize
    const mealAdjustment = v.agbMealsPerDay / 3
    const adjustedWeekly = weeklyTotal * mealAdjustment
    const monthlyGrocery = adjustedWeekly * 4.33
    const monthLyNoDelivery = (basePerPerson * dietFactor * v.agbHouseholdSize * mealAdjustment) * 4.33
    const deliverySurchargeAmt = monthlyGrocery - monthLyNoDelivery
    const monthlyTotal = monthlyGrocery
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Smart Grocery Budget', unit: '$', steps: [{ label: 'Base per Person Weekly', value: `$${basePerPerson.toFixed(2)} (${v.agbBudgetStrictness})` }, { label: 'Diet Adjustment', value: `${dietFactor.toFixed(2)}× (${v.agbDietType})` }, { label: 'Delivery Markup', value: `${deliveryFactor.toFixed(2)}× (${v.agbDeliveryPct})` }, { label: 'Weekly per Person', value: `$${basePerPerson.toFixed(2)} × ${dietFactor.toFixed(2)} × ${deliveryFactor.toFixed(2)} = $${weeklyPerPerson.toFixed(2)}` }, { label: 'Meal Adjustment', value: `${v.agbMealsPerDay}/3 meals = ${mealAdjustment.toFixed(1)}×` }, { label: 'Monthly Groceries', value: `$${monthlyGrocery.toFixed(2)}` }, { label: 'Delivery Surcharge', value: `+$${deliverySurchargeAmt.toFixed(2)}` }, { label: 'Total Monthly', value: `$${monthlyTotal.toFixed(2)}` }] ,
    extras: [
      { label: 'Diet Cost Comparison', value: `Vegan is cheapest (${((1 - 0.85) * 100).toFixed(0)}% less than standard). Keto costs ${((1.15 - 1) * 100).toFixed(0)}% more — meat, nuts, and specialty flours add up. Mediterranean is ${((1.05 - 1) * 100).toFixed(0)}% more but linked to longer life expectancy.` },
      { label: 'Delivery Fee Impact', value: `In-store shopping costs $${monthLyNoDelivery.toFixed(0)}/month. Adding delivery (${v.agbDeliveryPct}) adds $${deliverySurchargeAmt.toFixed(2)}/month ($${(deliverySurchargeAmt * 12).toFixed(0)}/year). A $10-15/month store membership (free delivery) pays for itself.` },
      { label: 'Batch Cooking Savings', value: 'Cooking 3+ servings per recipe cuts per-meal cost by 20-30%. If you cook ' + `${v.agbMealsPerDay}` + ' meals/day, batch cooking could save ~$' + `${(monthlyTotal * 0.2).toFixed(0)}` + '/month.' },
      { label: 'Seasonal Produce Strategy', value: 'Buying seasonal produce costs 30-50% less than out-of-season imports. A thrifty budget ($' + `${basePerPerson}/week)` + ' stretches further with a CSA box ($20-30/week for 2 people).' },
      { label: 'Protein Cost Efficiency', value: 'Cheapest proteins per lb: beans ($1-2), eggs ($2-4), chicken ($3-5), tofu ($2-4), pork ($3-6), beef ($5-10). A ' + `${v.agbDietType}` + ' diet at $' + `${basePerPerson}/week/person ` + (v.agbDietType === 'vegan' || v.agbDietType === 'vegetarian' ? 'saves on protein costs vs meat-based diets.' : 'can save 15-20% by including 2-3 plant-based meals/week.') },
      { label: 'Bulk Buying Thresholds', value: 'Rice, oats, lentils, and spices cost 40-60% less in bulk bins vs packaged. A $20 bulk run every 3 months saves ~$' + `${(20 * 0.5 * 4).toFixed(0)}` + '/year. But only buy bulk if you will use it before expiry.' },
      { label: 'Annual Grocery Projection', value: `At $${monthlyTotal.toFixed(0)}/month, you spend $${annualTotal.toFixed(0)}/year on groceries. That is $${(annualTotal / v.agbHouseholdSize).toFixed(0)} per person per year. The average US household of ${v.agbHouseholdSize} spends $${(monthlyTotal * 1.1).toFixed(0)}/month — you are ${monthlyTotal < 600 ? 'below' : 'near'} average.` },
    ]}
  },
  description: 'Smart grocery budget tool that adapts to household size, diet type (standard, vegetarian, vegan, keto, Mediterranean), spending level, and delivery habits. Optimize your food spending with diet-specific pricing and bulk-buying insights.',
  formula: 'Weekly/Person = Base Spend × Diet Factor × Delivery Factor | Monthly = (Weekly/Person × Household × Meals/3) × 4.33 | Diet Factors: Vegan 0.85, Vegetarian 0.9, Standard 1.0, Mediterranean 1.05, Keto 1.15',
  interpretation: 'A thrifty ($45/person/week) budget relies on rice, beans, eggs, and seasonal produce. Moderate ($70) adds organic produce and some premium items. Liberal ($100+) includes organic everything, specialty diet items, and imported goods. Vegan/vegetarian diets cost 10-15% less due to cheaper protein sources. Keto costs 15% more because of meat, nuts, and alternative flours. Delivery apps add 3-7% in inflated prices and fees — in-store shopping keeps the full budget on food. Batch cooking and seasonal buying can cut costs by another 20-30%.'
}

export default calcDef

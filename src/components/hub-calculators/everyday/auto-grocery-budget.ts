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
    const monthlyDelivery = v.agbDeliveryPct !== 'none' ? monthlyGrocery * (v.agbDeliveryPct === 'partial' ? 0.03 : 0.07) : 0
    const monthlyTotal = monthlyGrocery + monthlyDelivery
    return { result: monthlyTotal, label: 'Smart Grocery Budget', unit: '$', steps: [{ label: 'Per Person Weekly', value: `$${weeklyPerPerson.toFixed(2)}` }, { label: 'Household Weekly', value: `$${weeklyTotal.toFixed(2)}` }, { label: 'Meal Adjustment', value: `${mealAdjustment.toFixed(1)}×` }, { label: 'Adjusted Weekly', value: `$${adjustedWeekly.toFixed(2)}` }, { label: 'Monthly Groceries', value: `$${monthlyGrocery.toFixed(2)}` }, { label: 'Delivery Surcharge', value: `$${monthlyDelivery.toFixed(2)}` }, { label: 'Total Monthly', value: `$${monthlyTotal.toFixed(2)}` }] }
  },
  description: 'Smart grocery budget tool that adapts to household size, diet type, spending level, and delivery habits. Optimize your food spending with intelligent recommendations.',
  formula: 'Monthly = (Base/Person × Diet × Delivery × Household × Meals/3) × 4.33 + Delivery Fee',
  interpretation: 'Thrifty ($45/person/week): rice, beans, seasonal produce. Moderate ($70): mix of fresh and organic. Liberal ($100+): organic, specialty items. Delivery apps add 3-7% in hidden fees. Batch cooking cuts weekly costs by 20%.'
}

export default calcDef

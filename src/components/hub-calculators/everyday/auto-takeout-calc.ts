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
  compute: (v) => {
    const baseCost = v.atoMealsPerWeek * v.atoAvgCost
    const deliveryTotal = v.atoMealsPerWeek * v.atoDeliveryFee
    const tipAmount = baseCost * (v.atoTipPct / 100)
    const weeklyTotal = baseCost + deliveryTotal + tipAmount
    const monthlyTotal = weeklyTotal * 4.33
    const annualTotal = weeklyTotal * 52
    return { result: monthlyTotal, label: 'Monthly Takeout Cost', unit: '$', steps: [{ label: 'Weekly Food', value: '$' + baseCost.toFixed(2) }, { label: 'Delivery Fees', value: '$' + deliveryTotal.toFixed(2) }, { label: 'Tips', value: '$' + tipAmount.toFixed(2) }, { label: 'Weekly Total', value: '$' + weeklyTotal.toFixed(2) }, { label: 'Monthly Total', value: '$' + monthlyTotal.toFixed(2) }, { label: 'Annual Total', value: '$' + annualTotal.toFixed(2) }] }
  },
  description: 'Calculate how much you spend on takeout and delivery including food, fees, and tips. See monthly and annual totals.',
  formula: 'Weekly = (Meals x Cost + Meals x Delivery + Food x Tip%) | Monthly = Weekly x 4.33 | Annual = Weekly x 52',
  interpretation: 'Average takeout meal: $15-25 per person plus $3-7 delivery fee and 15-20% tip. Reducing takeout from 5x to 2x/week saves $3,000-5,000/year. Cooking at home costs 60% less per meal.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dailyFare: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), parkingCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'dailyFare', label: 'One-Way Fare ($)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'tripsPerDay', label: 'Trips per Day', type: 'number', min: 1, max: 4, step: '1' },
    { name: 'daysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 7, step: '1' },
    { name: 'gasCost', label: 'Weekly Gas Cost Saved ($)', type: 'number', min: 0, step: '10' },
    { name: 'parkingCost', label: 'Weekly Parking Saved ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => {
    const weeklyTransit = v.dailyFare * v.tripsPerDay * v.daysPerWeek
    const monthlyTransit = weeklyTransit * 4.33
    const monthlySavings = v.gasCost * 4.33 + v.parkingCost * 4.33 - monthlyTransit
    return { result: monthlyTransit, label: 'Monthly Transit Cost', unit: '$', steps: [{ label: 'Daily Cost', value: `$${(v.dailyFare * v.tripsPerDay).toFixed(2)}` }, { label: 'Weekly Cost', value: `$${weeklyTransit.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyTransit.toFixed(2)}` }, { label: 'Monthly Savings vs Driving', value: monthlySavings >= 0 ? `Save $${monthlySavings.toFixed(2)}` : `Cost $${Math.abs(monthlySavings).toFixed(2)} more` }] }
  },
  description: 'Calculate monthly public transit costs and compare savings against driving including gas and parking expenses.',
  formula: 'Monthly = Fare × Trips/Day × Days/Week × 4.33 | Savings = Gas + Parking - Transit',
  interpretation: 'Monthly transit pass is usually cheaper than daily fares if you commute 5 days/week. US average monthly transit pass: $50-130. IRS transit benefit: up to $300/month tax-free in 2024.'
}

export default calcDef

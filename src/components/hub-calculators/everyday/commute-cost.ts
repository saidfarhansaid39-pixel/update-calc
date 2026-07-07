import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), workDays: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'distance', label: 'One-Way Distance (mi)', type: 'number', min: 1, step: '1' },
    { name: 'mpg', label: 'Vehicle MPG', type: 'number', min: 10, step: '5' },
    { name: 'fuelCost', label: 'Fuel Price ($/gal)', type: 'number', min: 1, step: '0.5' },
    { name: 'workDays', label: 'Days Worked per Month', type: 'number', min: 1, max: 31, step: '1' },
  ],
  compute: (v) => {
    const dailyRoundTrip = v.distance * 2
    const dailyFuelCost = (dailyRoundTrip / v.mpg) * v.fuelCost
    const monthlyFuel = dailyFuelCost * v.workDays
    const annualFuel = monthlyFuel * 12
    return { result: monthlyFuel, label: 'Monthly Fuel Cost', unit: '$', steps: [{ label: 'Daily Round Trip', value: `${dailyRoundTrip} mi` }, { label: 'Daily Fuel Cost', value: `$${dailyFuelCost.toFixed(2)}` }, { label: 'Monthly Fuel', value: `$${monthlyFuel.toFixed(2)}` }, { label: 'Annual Fuel', value: `$${annualFuel.toFixed(2)}` }] }
  },
  description: 'Calculate your daily, monthly, and annual commute fuel costs. Enter distance, MPG, fuel price, and days worked to see your commuting expenses.',
  formula: 'Fuel Cost = (Distance×2 / MPG) × Fuel Price × Days',
  interpretation: 'The IRS mileage rate ($0.655/mi for 2024) includes fuel, maintenance, depreciation. Your true commute cost is about 2-3x the fuel cost alone. Consider carpooling, public transit, or remote work to reduce expenses.'
}

export default calcDef

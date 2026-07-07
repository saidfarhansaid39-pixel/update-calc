import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ accDistKm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accDaysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accFuelEff: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accFuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accParkingDaily: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), accTollsDaily: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'accDistKm', label: 'One-Way Distance (km)', type: 'number', min: 1, step: '5' },
    { name: 'accDaysPerWeek', label: 'Days Commuting per Week', type: 'number', min: 1, max: 7, step: '1' },
    { name: 'accFuelEff', label: 'Fuel Efficiency (km/L)', type: 'number', min: 5, step: '1' },
    { name: 'accFuelPrice', label: 'Fuel Price per Liter ($)', type: 'number', min: 0.5, step: '0.1' },
    { name: 'accParkingDaily', label: 'Daily Parking Cost ($)', type: 'number', min: 0, step: '2' },
    { name: 'accTollsDaily', label: 'Daily Tolls ($)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const dailyDist = v.accDistKm * 2
    const dailyFuel = dailyDist / v.accFuelEff
    const dailyFuelCost = dailyFuel * v.accFuelPrice
    const dailyTotal = dailyFuelCost + v.accParkingDaily + v.accTollsDaily
    const weekly = dailyTotal * v.accDaysPerWeek
    const monthly = weekly * 4.33
    const annual = weekly * 52
    const annualKm = dailyDist * v.accDaysPerWeek * 52
    return { result: monthly, label: 'Monthly Commute Cost', unit: '$', steps: [{ label: 'Daily Distance', value: `${dailyDist} km` }, { label: 'Daily Fuel', value: `${dailyFuel.toFixed(2)} L` }, { label: 'Daily Fuel Cost', value: `$${dailyFuelCost.toFixed(2)}` }, { label: 'Daily with Parking/Tolls', value: `$${dailyTotal.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthly.toFixed(2)}` }, { label: 'Annual Kilometers', value: `${annualKm.toFixed(0)} km` }] }
  },
  description: 'Calculate total commuting costs including fuel, parking, and tolls. Understand the true cost of driving to work each day.',
  formula: 'Monthly = ((Dist×2 / Eff × FuelPrice) + Parking + Tolls) × Days/Week × 4.33',
  interpretation: 'Average commute: 16 km one-way, costing $150-300/month. Working from home 2 days/week saves 40% on commute costs. Carpooling cuts costs by 50%. Public transit may be cheaper: $70-120/month for a pass.'
}

export default calcDef

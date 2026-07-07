import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tripDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripGasPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripHotelNights: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tripHotelRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tripFoodPerDay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tripDays: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'tripDist', label: 'Total Drive Distance (mi)', type: 'number', min: 10, step: '50' },
    { name: 'tripMpg', label: 'Vehicle MPG', type: 'number', min: 5, step: '1' },
    { name: 'tripGasPrice', label: 'Gas Price per Gallon ($)', type: 'number', min: 1, step: '0.5' },
    { name: 'tripHotelNights', label: 'Hotel Nights', type: 'number', min: 0, step: '1' },
    { name: 'tripHotelRate', label: 'Hotel Rate per Night ($)', type: 'number', min: 0, step: '25' },
    { name: 'tripFoodPerDay', label: 'Daily Food Budget ($)', type: 'number', min: 0, step: '10' },
    { name: 'tripDays', label: 'Trip Duration (days)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const gallons = v.tripDist / v.tripMpg
    const gasCost = gallons * v.tripGasPrice
    const lodging = v.tripHotelNights * v.tripHotelRate
    const food = v.tripDays * v.tripFoodPerDay
    const misc = (gasCost + lodging + food) * 0.08
    const total = gasCost + lodging + food + misc
    const perDay = total / v.tripDays
    const costPerMile = total / v.tripDist
    return { result: total, label: 'Total Trip Cost', unit: '$', steps: [{ label: 'Fuel Cost', value: gallons.toFixed(1) + ' gal x $' + v.tripGasPrice.toFixed(2) + ' = $' + gasCost.toFixed(2) }, { label: 'Lodging', value: '$' + lodging.toFixed(2) }, { label: 'Food', value: '$' + food.toFixed(2) }, { label: 'Misc (8%)', value: '$' + misc.toFixed(2) }, { label: 'Total', value: '$' + total.toFixed(2) }, { label: 'Per Day', value: '$' + perDay.toFixed(2) }] }
  },
  description: 'Calculate total road trip cost including fuel, lodging, food, and a miscellaneous buffer. Great for trip planning and budgeting.',
  formula: 'Total = Gas + Hotel + Food + Misc | Gas = Miles/MPG x Price | Misc = 8% buffer | PerDay = Total / Days',
  interpretation: 'Road trip costs: gas ~30%, lodging ~35%, food ~25%, misc ~10%. Budget $150-250/day for a comfortable trip. Gas cost for 1,000 mi at 25 MPG: ~$150 at $3.75/gal. Use hotel points and cook some meals to save.'
}

export default calcDef

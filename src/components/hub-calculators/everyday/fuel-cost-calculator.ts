import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tripMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vehicleMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'tripMiles', label: 'Trip Distance (miles)', type: 'number', min: 1, step: '10' },
    { name: 'vehicleMpg', label: 'Vehicle MPG', type: 'number', min: 5, step: '1' },
    { name: 'fuelPrice', label: 'Fuel Price per Gallon ($)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const gallons = v.tripMiles / v.vehicleMpg
    const cost = gallons * v.fuelPrice
    const costPerMile = cost / v.tripMiles
    return { result: cost, label: 'Total Fuel Cost', unit: '$', steps: [{ label: 'Gallons Needed', value: `${gallons.toFixed(2)} gal` }, { label: 'Fuel Cost', value: `$${cost.toFixed(2)}` }, { label: 'Cost per Mile', value: `$${costPerMile.toFixed(3)}` }] }
  },
  description: 'Calculate fuel cost for any trip using distance, vehicle fuel efficiency, and current fuel price.',
  formula: 'Fuel Cost = (Miles ÷ MPG) × Price per Gallon',
  interpretation: 'Fuel is typically 30-40% of total driving cost. Use apps like GasBuddy to find the cheapest gas along your route. Driving at 55 mph vs 65 mph improves MPG by ~15%.'
}

export default calcDef

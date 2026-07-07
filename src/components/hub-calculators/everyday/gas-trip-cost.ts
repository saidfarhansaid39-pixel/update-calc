import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tripDistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mpgRating: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasPricePerGal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), returnTrip: z.string().min(1) }),
  fields: [
    { name: 'tripDistance', label: 'One-Way Distance (miles)', type: 'number', min: 1, step: '10' },
    { name: 'mpgRating', label: 'Vehicle MPG', type: 'number', min: 5, step: '1' },
    { name: 'gasPricePerGal', label: 'Gas Price per Gallon ($)', type: 'number', min: 1, step: '0.5' },
    { name: 'returnTrip', label: 'Include Return Trip', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const totalMiles = v.returnTrip === 'yes' ? v.tripDistance * 2 : v.tripDistance
    const gallons = totalMiles / v.mpgRating
    const cost = gallons * v.gasPricePerGal
    return { result: cost, label: 'Gas Cost', unit: '$', steps: [{ label: 'Total Miles', value: `${totalMiles} mi` }, { label: 'Gallons Needed', value: `${gallons.toFixed(2)} gal` }, { label: 'Fuel Cost', value: `$${cost.toFixed(2)}` }] }
  },
  description: 'Calculate the fuel cost for a road trip based on distance, vehicle MPG, and current gas prices. Optionally include return trip.',
  formula: 'Cost = (Distance × Direction × Price) / MPG | Direction: 1 (one-way) or 2 (round trip)',
  interpretation: 'Gas prices vary by region. Use apps to find cheapest gas along your route. Consider fuel-efficient routing and avoiding peak traffic to save gas.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ miles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pricePerGallon: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'miles', label: 'Trip Distance (miles)', type: 'number', min: 1, step: '10' },
    { name: 'mpg', label: 'Vehicle MPG', type: 'number', min: 1, step: '1' },
    { name: 'pricePerGallon', label: 'Fuel Price per Gallon ($)', type: 'number', min: 1, step: '0.3' },
  ],
  compute: (v) => { const mi = parseFloat(v.miles)||0; const m = parseFloat(v.mpg)||0; const ppg = parseFloat(v.pricePerGallon)||0; const gallons = mi / m; const cost = gallons * ppg; return { result: cost, label: 'Fuel Cost', unit: '$', steps: [{ label: 'Gallons Needed', value: `${gallons.toFixed(2)} gal` }, { label: 'Total Fuel Cost', value: `$${cost.toFixed(2)}` }] } },
  description: 'Calculate fuel cost for a trip based on distance, vehicle fuel efficiency, and current gas prices.',
  formula: 'Cost = (Miles ÷ MPG) × Price per Gallon',
  interpretation: 'Gas prices vary by ~$1/gal between states. Combining errands into one trip saves fuel. Every 5 mph over 55 mph reduces MPG by ~7%.'
}

export default calcDef

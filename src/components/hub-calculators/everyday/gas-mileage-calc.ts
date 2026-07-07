import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ milesDrivenTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gallonsUsedTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'milesDrivenTotal', label: 'Miles Driven', type: 'number', min: 1, step: '10' },
    { name: 'gallonsUsedTotal', label: 'Gallons Used', type: 'number', min: 0.1, step: '0.5' },
  ],
  compute: (v) => {
    const mpg = v.milesDrivenTotal / v.gallonsUsedTotal
    const l100km = 235.215 / mpg
    return { result: mpg, label: 'Fuel Economy', unit: 'MPG', steps: [{ label: 'Miles per Gallon', value: `${mpg.toFixed(1)} MPG` }, { label: 'L/100km', value: `${l100km.toFixed(1)} L/100km` }] }
  },
  description: 'Calculate your vehicle gas mileage from miles driven and gallons of fuel used. Track fuel economy over time.',
  formula: 'MPG = Miles ÷ Gallons | L/100km = 235.215 ÷ MPG',
  interpretation: 'Track mileage over multiple fill-ups for accuracy. Factors affecting MPG: driving habits, tire pressure, fuel quality, vehicle maintenance, and seasonal weather.'
}

export default calcDef

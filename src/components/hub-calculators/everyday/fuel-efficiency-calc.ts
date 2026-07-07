import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ milesTraveled: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gallonsConsumed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'milesTraveled', label: 'Miles Traveled', type: 'number', min: 1, step: '10' },
    { name: 'gallonsConsumed', label: 'Gallons Used', type: 'number', min: 0.1, step: '0.5' },
  ],
  compute: (v) => {
    const mpg = v.milesTraveled / v.gallonsConsumed
    const lPer100km = 235.215 / mpg
    return { result: mpg, label: 'Fuel Efficiency', unit: 'MPG', steps: [{ label: 'Miles per Gallon', value: `${mpg.toFixed(1)} MPG` }, { label: 'Liters per 100 km', value: `${lPer100km.toFixed(1)} L/100km` }, { label: 'Fuel Used', value: `${v.gallonsConsumed} gal` }] }
  },
  description: 'Calculate your vehicle fuel efficiency in MPG and L/100km based on miles driven and gallons of fuel consumed.',
  formula: 'MPG = Miles ÷ Gallons | L/100km = 235.215 ÷ MPG',
  interpretation: 'Fill up fully and reset trip meter for accurate readings. Average over 3-5 tanks for reliable data. Winter blend gas reduces MPG by 5-10%. Proper tire inflation improves MPG by up to 3%.'
}

export default calcDef

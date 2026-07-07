import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ milesDriven: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gallonsUsed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'milesDriven', label: 'Miles Driven', type: 'number', min: 1, step: '10' },
    { name: 'gallonsUsed', label: 'Gallons Used', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => { const md = parseFloat(v.milesDriven)||0; const gu = parseFloat(v.gallonsUsed)||0; const mpg = md / gu; const lPer100km = 235.215 / mpg; return { result: mpg, label: 'Fuel Economy', unit: 'MPG', steps: [{ label: 'Miles per Gallon', value: `${mpg.toFixed(1)} mpg` }, { label: 'Liters per 100 km', value: `${lPer100km.toFixed(1)} L/100km` }] } },
  description: 'Calculate your vehicle fuel economy in MPG and L/100km from miles driven and gallons used. Fill up completely for accuracy.',
  formula: 'MPG = Miles Driven ÷ Gallons Used | L/100km = 235.215 ÷ MPG',
  interpretation: 'Typical sedan: 25-35 mpg, SUV: 15-25 mpg, Hybrid: 40-60 mpg. Track over 3+ tanks for accurate average. Seasonal blend changes affect MPG in winter.'
}

export default calcDef

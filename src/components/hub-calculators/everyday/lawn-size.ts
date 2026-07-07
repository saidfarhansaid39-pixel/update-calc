import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shape: z.string().min(1) }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '10' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '10' },
    { name: 'shape', label: 'Lawn Shape', type: 'select', options: [{ label: 'Rectangle', value: 'rectangle' }, { label: 'Triangle', value: 'triangle' }, { label: 'Circle', value: 'circle' }] },
  ],
  compute: (v) => {
    let sqft = 0
    if (v.shape === 'rectangle') sqft = v.length * v.width
    else if (v.shape === 'triangle') sqft = 0.5 * v.length * v.width
    else if (v.shape === 'circle') sqft = Math.PI * Math.pow(v.length / 2, 2)
    const acres = sqft / 43560
    const hectares = sqft * 0.0000092903
    return { result: sqft, label: 'Lawn Area', unit: 'sq ft', steps: [{ label: 'Area', value: `${sqft.toFixed(0)} sq ft` }, { label: 'Acres', value: `${acres.toFixed(4)}` }, { label: 'Hectares', value: `${hectares.toFixed(4)}` }] }
  },
  description: 'Calculate lawn area in square feet, acres, and hectares for planning mowing, fertilizing, and irrigation.',
  formula: 'Rectangle: L×W | Triangle: 0.5×L×W | Circle: π×(D/2)²',
  interpretation: 'Average US lawn: 0.2-0.5 acres (8,712-21,780 sq ft). Mowing time ≈ area / 5000 sq ft per hour with a standard push mower.'
}

export default calcDef

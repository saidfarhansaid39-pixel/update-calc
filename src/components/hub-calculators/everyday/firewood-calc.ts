import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cords: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pricePerCord: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'cords', label: 'Cords of Firewood', type: 'number', min: 0.1, step: '0.5' },
    { name: 'pricePerCord', label: 'Price per Cord ($)', type: 'number', min: 1, step: '10' },
  ],
  compute: (v) => { const c = parseFloat(v.cords)||0; const p = parseFloat(v.pricePerCord)||0; const total = c * p; return { result: total, label: 'Total Cost', unit: '$', steps: [{ label: 'Cost per Cord', value: `$${p.toFixed(2)}` }, { label: 'Total for ' + c + ' Cords', value: `$${total.toFixed(2)}` }] } },
  description: 'Calculate total cost of firewood based on cords purchased and price per cord. A standard cord is 128 cubic feet (4×4×8 ft).',
  formula: 'Total = Cords × Price per Cord',
  interpretation: 'A full cord (4×4×8 ft) typically costs $200-500 depending on wood type and region. Seasoned hardwood burns longer and cleaner than green wood. A cord weighs 2-4 tons.'
}

export default calcDef

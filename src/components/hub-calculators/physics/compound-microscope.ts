import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fo: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fe: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), L: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'fo', label: 'Objective Focal Length', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'fe', label: 'Eyepiece Focal Length', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'L', label: 'Tube Length', type: 'number', unit: 'cm', min: 1, step: '1' }],
  compute: (v) => { const M = (v.L / v.fo) * (25 / v.fe); return { result: M, label: 'Total Magnification', unit: '×', steps: [{ label: 'Formula', value: 'M = (L/fₒ) × (25/fₑ)' }, { label: 'Objective mag', value: `${(v.L / v.fo).toFixed(1)}×` }, { label: 'Eyepiece mag', value: `${(25 / v.fe).toFixed(1)}×` }, { label: 'Total', value: `${M.toFixed(1)}×` }] } },
  description: 'A compound microscope uses two lenses (objective and eyepiece) to achieve high magnification of small specimens.',
  formula: 'M = (L/fₒ) × (25/fₑ)',
  interpretation: 'The objective produces a real, inverted, magnified image. The eyepiece acts as a simple magnifier. Total magnification is the product of objective and eyepiece magnifications. 25 cm is the near point.'
}

export default calcDef

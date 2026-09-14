import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fo: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fe: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), L: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'fo', label: 'Objective Focal Length', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'fe', label: 'Eyepiece Focal Length', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'L', label: 'Tube Length', type: 'number', unit: 'cm', min: 1, step: '1' }],
  defaults: { fo: '1', fe: '1', L: '1' },
  presets: [
    { label: 'Standard example 1', values: { fo: '1', fe: '1', L: '1' } },
    { label: 'Standard example 2', values: { fo: '10', fe: '10', L: '10' } },
    { label: 'Standard example 3', values: { fo: '100', fe: '100', L: '100' } },
  ],
  compute: (v) => { const M = (v.L / v.fo) * (25 / v.fe); return { result: M, label: 'Total Magnification', unit: '×', steps: [{ label: 'Formula', value: 'M = (L/fₒ) × (25/fₑ)' }, { label: 'Objective mag', value: `${(v.L / v.fo).toFixed(1)}×` }, { label: 'Eyepiece mag', value: `${(25 / v.fe).toFixed(1)}×` }, { label: 'Total', value: `${M.toFixed(1)}×` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'A compound microscope uses two lenses (objective and eyepiece) to achieve high magnification of small specimens.',
  formula: 'M = (L/fₒ) × (25/fₑ)',
  interpretation: 'The objective produces a real, inverted, magnified image. The eyepiece acts as a simple magnifier. Total magnification is the product of objective and eyepiece magnifications. 25 cm is the near point.'
}

export default calcDef

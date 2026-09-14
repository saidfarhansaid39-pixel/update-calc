import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fo: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fe: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'fo', label: 'Objective Focal Length', type: 'number', unit: 'cm', min: 1, step: '1' }, { name: 'fe', label: 'Eyepiece Focal Length', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }],
  defaults: { fo: '1', fe: '1' },
  presets: [
    { label: 'Standard example 1', values: { fo: '1', fe: '1' } },
    { label: 'Standard example 2', values: { fo: '10', fe: '10' } },
    { label: 'Standard example 3', values: { fo: '100', fe: '100' } },
  ],
  compute: (v) => { const M = v.fo / v.fe; return { result: M, label: 'Angular Magnification', unit: '×', steps: [{ label: 'Formula', value: 'M = fₒ/fₑ' }, { label: 'Result', value: `${M.toFixed(1)}×` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'An astronomical telescope uses a large objective lens/mirror to collect light and an eyepiece to magnify the image for viewing.',
  formula: 'M = fₒ / fₑ',
  interpretation: 'The objective creates a real image at its focal plane. The eyepiece magnifies this image. A 100 cm objective with 1 cm eyepiece gives 100× magnification. Larger objective diameter collects more light for fainter objects.'
}

export default calcDef

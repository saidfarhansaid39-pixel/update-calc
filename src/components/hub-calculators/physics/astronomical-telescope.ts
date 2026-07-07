import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fo: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fe: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'fo', label: 'Objective Focal Length', type: 'number', unit: 'cm', min: 1, step: '1' }, { name: 'fe', label: 'Eyepiece Focal Length', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }],
  compute: (v) => { const M = v.fo / v.fe; return { result: M, label: 'Angular Magnification', unit: '×', steps: [{ label: 'Formula', value: 'M = fₒ/fₑ' }, { label: 'Result', value: `${M.toFixed(1)}×` }] } },
  description: 'An astronomical telescope uses a large objective lens/mirror to collect light and an eyepiece to magnify the image for viewing.',
  formula: 'M = fₒ / fₑ',
  interpretation: 'The objective creates a real image at its focal plane. The eyepiece magnifies this image. A 100 cm objective with 1 cm eyepiece gives 100× magnification. Larger objective diameter collects more light for fainter objects.'
}

export default calcDef

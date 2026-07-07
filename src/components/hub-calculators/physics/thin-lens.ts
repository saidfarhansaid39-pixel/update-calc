import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ focal: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), objDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'focal', label: 'Focal Length', type: 'number', unit: 'cm', step: '0.1' }, { name: 'objDist', label: 'Object Distance', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }],
  compute: (v) => { const imgDist = 1 / (1 / v.focal - 1 / v.objDist); const mag = -imgDist / v.objDist; return { result: imgDist, label: 'Image Distance', unit: 'cm', steps: [{ label: 'Formula', value: '1/f = 1/dₒ + 1/dᵢ' }, { label: 'Image distance', value: `${imgDist.toFixed(2)} cm` }, { label: 'Magnification', value: `${mag.toFixed(2)}×` }] } },
  description: 'The thin lens equation relates focal length, object distance, and image distance for converging and diverging lenses.',
  formula: '1/f = 1/dₒ + 1/dᵢ',
  interpretation: 'Positive f = converging lens. Positive image distance = real image. |M| > 1 means magnified. For a converging lens with dₒ > f, the image is real and inverted.'
}

export default calcDef

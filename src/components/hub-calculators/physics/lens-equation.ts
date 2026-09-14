import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ focal: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), objDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'focal', label: 'Focal Length', type: 'number', unit: 'cm', step: '0.1' }, { name: 'objDist', label: 'Object Distance', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }],
  defaults: { focalLength: '0.1', objectDistance: '0.2' },
  presets: [
    { label: 'Magnifying glass (f=10 cm, d=15 cm)', values: { focalLength: '0.1', objectDistance: '0.15' } },
    { label: 'Camera lens (f=50 mm, d=5 m)', values: { focalLength: '0.05', objectDistance: '5' } },
    { label: 'Reading glasses (f=40 cm, d=25 cm)', values: { focalLength: '0.4', objectDistance: '0.25' } },
  ],
  compute: (v) => { const imgDist = 1 / (1 / v.focal - 1 / v.objDist); const mag = -imgDist / v.objDist; return { result: imgDist, label: 'Image Distance', unit: 'cm', steps: [{ label: 'Formula', value: '1/f = 1/dₒ + 1/dᵢ' }, { label: 'Substitute', value: `1/${v.focal} = 1/${v.objDist} + 1/dᵢ` }, { label: 'Image distance', value: `${imgDist.toFixed(2)} cm` }, { label: 'Magnification', value: `${mag.toFixed(2)}×` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Lens equation is used in cameras, eyeglasses, microscopes, and telescopes. Determines image position, size, and type (real/virtual).' },
        { label: 'Common Values', value: 'Human eye: f ≈ 17 mm. Reading glasses: +2.5 D (f=40 cm). Camera lens: 24-200 mm. Magnifying glass: f=5-20 cm. Power in diopters: D = 1/f.' },
        { label: 'Precision Tip', value: '1/f = 1/d_o + 1/d_i. Positive f = converging lens. Negative f = diverging. Real image: d_i > 0. Virtual: d_i < 0. Magnification M = -d_i/d_o.' },
        { label: 'Related Formula', value: 'Thin lens: 1/f = 1/d_o + 1/d_i. Lens maker: 1/f = (n-1)(1/R₁ - 1/R₂). Magnification: M = h_i/h_o = -d_i/d_o. Power: P = 1/f (diopters).' },
        { label: 'Unit Conversion Note', value: 'f, d_o, d_i in same units (typically m). Diopters: 1/f in m⁻¹. 25 cm = near point of human eye. Convert cm to m: divide by 100.' }
      ]} },
  description: 'The thin lens equation relates focal length, object distance, and image distance. Positive f = converging, negative f = diverging.',
  formula: '1/f = 1/dₒ + 1/dᵢ',
  interpretation: 'A positive image distance means a real image; negative means virtual. |M| > 1 means magnification, |M| < 1 means minification.'
}

export default calcDef

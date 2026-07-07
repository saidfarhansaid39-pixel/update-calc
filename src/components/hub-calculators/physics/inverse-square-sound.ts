import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ refIntensity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), refDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), newDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'refIntensity', label: 'Reference Intensity', type: 'number', unit: 'W/m^2', min: 1e-12, step: '1e-12' }, { name: 'refDist', label: 'Reference Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'newDist', label: 'New Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  compute: (v) => { const I = v.refIntensity * (v.refDist * v.refDist) / (v.newDist * v.newDist); const dB_orig = 10 * Math.log10(v.refIntensity / 1e-12); const dB_new = 10 * Math.log10(I / 1e-12); return { result: I, label: 'Intensity at New Distance', unit: 'W/m^2', steps: [{ label: 'Formula', value: 'I ∝ 1/r^2' }, { label: 'Original SPL', value: `${dB_orig.toFixed(1)} dB` }, { label: 'New intensity', value: `${I.toExponential(4)} W/m^2` }, { label: 'New SPL', value: `${dB_new.toFixed(1)} dB` }] } },
  description: 'Sound intensity decreases with the square of distance from a point source in free field conditions.',
  formula: 'I2 = I1(r1/r2)^2',
  interpretation: 'Doubling distance reduces intensity by a factor of 4 (about -6 dB). The inverse square law applies to any isotropic point source of radiation.'
}

export default calcDef

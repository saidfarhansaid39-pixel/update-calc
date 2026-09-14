import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ refIntensity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), refDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), newDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'refIntensity', label: 'Reference Intensity', type: 'number', unit: 'W/m^2', min: 1e-12, step: '1e-12' }, { name: 'refDist', label: 'Reference Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'newDist', label: 'New Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  defaults: { refIntensity: '1', refDist: '1', newDist: '1' },
  presets: [
    { label: 'Standard example 1', values: { refIntensity: '1', refDist: '1', newDist: '1' } },
    { label: 'Standard example 2', values: { refIntensity: '10', refDist: '10', newDist: '10' } },
    { label: 'Standard example 3', values: { refIntensity: '100', refDist: '100', newDist: '100' } },
  ],
  compute: (v) => { const I = v.refIntensity * (v.refDist * v.refDist) / (v.newDist * v.newDist); const dB_orig = 10 * Math.log10(v.refIntensity / 1e-12); const dB_new = 10 * Math.log10(I / 1e-12); return { result: I, label: 'Intensity at New Distance', unit: 'W/m^2', steps: [{ label: 'Formula', value: 'I ∝ 1/r^2' }, { label: 'Original SPL', value: `${dB_orig.toFixed(1)} dB` }, { label: 'New intensity', value: `${I.toExponential(4)} W/m^2` }, { label: 'New SPL', value: `${dB_new.toFixed(1)} dB` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Sound intensity decreases with the square of distance from a point source in free field conditions.',
  formula: 'I2 = I1(r1/r2)^2',
  interpretation: 'Doubling distance reduces intensity by a factor of 4 (about -6 dB). The inverse square law applies to any isotropic point source of radiation.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ power: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'power', label: 'Sound Power', type: 'number', unit: 'W', min: 1e-6, step: '1e-6' }, { name: 'distance', label: 'Distance from Source', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  compute: (v) => { const I = v.power / (4 * Math.PI * v.distance * v.distance); const dB = 10 * Math.log10(I / 1e-12); return { result: I, label: 'Intensity', unit: 'W/m^2', steps: [{ label: 'Formula', value: 'I = P/(4πr^2)' }, { label: 'Intensity', value: `${I.toExponential(4)} W/m^2` }, { label: 'Sound Level', value: `${dB.toFixed(1)} dB` }] } },
  description: 'Sound intensity decreases with the square of distance from a point source. The inverse square law governs spherical wave propagation.',
  formula: 'I = P/(4πr^2)',
  interpretation: 'Doubling distance reduces intensity by a factor of 4 (-6 dB). Normal conversation is ~60 dB at 1 m. Threshold of hearing is 10^-12 W/m^2.'
}

export default calcDef

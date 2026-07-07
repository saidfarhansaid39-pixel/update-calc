import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    substrate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    velocity: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    km: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'substrate', label: 'Substrate Conc. [S]', type: 'number', unit: 'mM', min: 0.001, step: '0.001' },
    { name: 'velocity', label: 'Reaction Velocity (v)', type: 'number', unit: 'µM/min', min: 0.001, step: '0.001' },
    { name: 'km', label: 'Km (optional)', type: 'number', unit: 'mM', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const estimatedKm = v.km || v.substrate / 2
    const vmax = v.velocity * (estimatedKm + v.substrate) / v.substrate
    const subHalf = estimatedKm
    const vHalf = vmax * subHalf / (estimatedKm + subHalf)
    return {
      result: vmax, label: 'Estimated Vmax', unit: 'µM/min',
      steps: [
        { label: '[S]', value: `${v.substrate} mM` },
        { label: 'v at [S]', value: `${v.velocity} µM/min` },
        { label: 'Km', value: `${estimatedKm.toFixed(4)} mM` },
        { label: 'Vmax (calculated)', value: `${vmax.toFixed(4)} µM/min` },
        { label: 'At [S] = Km', value: `v = ${vHalf.toFixed(4)} µM/min (½ Vmax)` },
      ]
}
  },
  description: 'The Michaelis-Menten equation describes enzyme kinetics. Vmax and Km are key parameters characterizing enzyme activity and substrate affinity.',
  formula: 'v = Vmax × [S] / (Km + [S]) | Vmax = v × (Km + [S]) / [S]',
  interpretation: 'Km = substrate concentration at ½ Vmax (affinity). Low Km = high affinity. Vmax = maximum reaction rate at saturating substrate.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    initConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0')
}),
  fields: [
    { name: 'k', label: 'Rate Constant k', type: 'number', unit: 'M⁻¹·s⁻¹', min: 1e-10, step: 'any' },
    { name: 'initConc', label: 'Initial Concentration [A]₀', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'time', label: 'Time t', type: 'number', unit: 's', min: 0, step: '1' },
  ],
  compute: (v) => {
    const conc = 1 / (1 / v.initConc + v.k * v.time)
    const halfLife = 1 / (v.k * v.initConc)
    return {
      result: conc, label: 'Concentration [A] at time t', unit: 'M',
      steps: [
        { label: 'k', value: `${v.k.toExponential(4)} M⁻¹·s⁻¹` },
        { label: '[A]₀', value: `${v.initConc} M` },
        { label: 't', value: `${v.time} s` },
        { label: '1/[A] = 1/[A]₀ + kt', value: `${(1 / conc).toExponential(4)} M⁻¹` },
        { label: '[A] = 1 / (1/[A]₀ + kt)', value: `${conc.toExponential(4)} M` },
        { label: 'Half-life t½ = 1/(k[A]₀)', value: `${halfLife.toExponential(4)} s` },
      ]
}
  },
  description: 'The second-order integrated rate law: 1/[A] = 1/[A]₀ + kt. A plot of 1/[A] vs t yields a straight line with slope k.',
  formula: '1/[A] = 1/[A]₀ + kt | t½ = 1/(k[A]₀)',
  interpretation: 'Unlike first-order, the half-life depends on initial concentration — each successive half-life doubles. Second-order reactions include dimerization and reactions between two identical molecules.'
}

export default calcDef

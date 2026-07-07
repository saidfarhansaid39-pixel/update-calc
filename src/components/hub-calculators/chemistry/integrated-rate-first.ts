import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    initConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0')
}),
  fields: [
    { name: 'k', label: 'Rate Constant k', type: 'number', unit: 's⁻¹', min: 1e-10, step: 'any' },
    { name: 'initConc', label: 'Initial Concentration [A]₀', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'time', label: 'Time t', type: 'number', unit: 's', min: 0, step: '1' },
  ],
  compute: (v) => {
    const conc = v.initConc * Math.exp(-v.k * v.time)
    const halfLife = Math.LN2 / v.k
    return {
      result: conc, label: 'Concentration [A] at time t', unit: 'M',
      steps: [
        { label: 'k', value: `${v.k.toExponential(4)} s⁻¹` },
        { label: '[A]₀', value: `${v.initConc} M` },
        { label: 't', value: `${v.time} s` },
        { label: '[A] = [A]₀·e^(-kt)', value: `${conc.toExponential(4)} M` },
        { label: 'Half-life t½ = ln(2)/k', value: `${halfLife.toExponential(4)} s` },
      ]
}
  },
  description: 'The first-order integrated rate law describes exponential decay: ln[A] = -kt + ln[A]₀. A plot of ln[A] vs t gives a straight line with slope -k.',
  formula: '[A] = [A]₀ × e^(-kt) | t½ = ln(2)/k',
  interpretation: 'Radioactive decay and many decomposition reactions follow first-order kinetics. The half-life is constant — independent of initial concentration. After one half-life, 50% remains.'
}

export default calcDef

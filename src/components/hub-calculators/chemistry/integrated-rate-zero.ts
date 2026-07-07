import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    initConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0')
}),
  fields: [
    { name: 'k', label: 'Rate Constant k', type: 'number', unit: 'M/s', min: 1e-10, step: 'any' },
    { name: 'initConc', label: 'Initial Concentration [A]₀', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'time', label: 'Time t', type: 'number', unit: 's', min: 0, step: '1' },
  ],
  compute: (v) => {
    const conc = Math.max(0, v.initConc - v.k * v.time)
    const halfLife = v.initConc / (2 * v.k)
    const depleted = conc <= 0
    return {
      result: conc, label: 'Concentration [A] at time t', unit: 'M',
      steps: [
        { label: 'k', value: `${v.k.toExponential(4)} M/s` },
        { label: '[A]₀', value: `${v.initConc} M` },
        { label: 't', value: `${v.time} s` },
        { label: '[A] = [A]₀ - kt', value: `${conc.toExponential(4)} M` },
        { label: 'Half-life t½ = [A]₀/(2k)', value: `${halfLife.toExponential(4)} s` },
        { label: 'Status', value: depleted ? 'Reactant fully consumed' : 'Reactant still present' },
      ]
}
  },
  description: 'The zero-order integrated rate law: [A] = [A]₀ - kt. The concentration decreases linearly with time at a constant rate.',
  formula: '[A] = [A]₀ - kt | t½ = [A]₀/(2k)',
  interpretation: 'Zero-order kinetics is common for enzyme-catalyzed reactions at high substrate concentration (saturation) and photochemical reactions with constant light intensity. The rate does not depend on concentration.'
}

export default calcDef

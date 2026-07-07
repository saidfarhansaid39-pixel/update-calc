import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'k', label: 'Decay Constant (k)', type: 'number', unit: 's⁻¹', min: 0.0001, step: 'any' },
  ],
  compute: (v) => {
    const halfLife = Math.LN2 / v.k
    const meanLife = 1 / v.k
    return {
      result: halfLife, label: 'Half-Life', unit: 's',
      steps: [
        { label: 'Decay constant k', value: `${v.k.toExponential(4)} s⁻¹` },
        { label: 't½ = ln(2) / k', value: `${halfLife.toExponential(4)} s` },
        { label: 'Mean lifetime = 1/k', value: `${meanLife.toExponential(4)} s` },
      ]
}
  },
  description: 'Half-life (t½) is the time required for half of a radioactive substance to decay. It is inversely proportional to the decay constant.',
  formula: 't½ = ln(2) / k',
  interpretation: 'A larger decay constant means a shorter half-life. After n half-lives, the fraction remaining is (1/2)ⁿ. After 10 half-lives, less than 0.1% remains.'
}

export default calcDef

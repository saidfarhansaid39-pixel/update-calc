import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ z: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('z', 'Z-score (z)')],
    defaults: { z: '1.96' },
    compute: (v) => {
      const z = n(v.z)
      const cdf = (x: number) => { const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429]; const p = 0.3275911; const sign = x < 0 ? -1 : 1; const ax = Math.abs(x) / Math.sqrt(2); const t = 1 / (1 + p * ax); let y = 1 - (((((a[4] * t + a[3]) * t + a[2]) * t + a[1]) * t + a[0]) * t * Math.exp(-ax * ax)); return 0.5 * (1 + sign * y) }
      const prob = cdf(z)
      return { result: prob.toFixed(6), label: 'P(Z <= z)', steps: [step('Z-score', z.toFixed(4)), step('CDF value', prob.toFixed(6)), step('Interpretation', 'P(Z <= ' + z.toFixed(4) + ') = ' + prob.toFixed(6))] }
    },
    formula: 'Standard Normal CDF using approximation.',
    description: 'Calculate cumulative probability for a standard normal distribution.',
    interpretation: 'The probability that a standard normal variable is less than or equal to z.'
}

export default calcDef

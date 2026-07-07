import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number')
}),
    fields: [numField('a', 'Z-Score (z)'), numField('b', 'Tails (1 or 2)')],
    defaults: { a: '1.96', b: '2' },
    compute: (v) => {
      const a = n(v.a), b = Math.round(n(v.b))
      const stdNormalCdf = (x: number): number => {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
        const sign = x < 0 ? -1 : 1; x = Math.abs(x) / Math.sqrt(2)
        const t = 1 / (1 + p * x)
        const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
        return 0.5 * (1 + sign * y)
      }
      const cdf = stdNormalCdf(a)
      const pOneTail = 1 - cdf
      const pTwoTail = 2 * pOneTail
      const pVal = b === 1 ? pOneTail : pTwoTail
      return { result: pVal.toFixed(6), label: 'P-Value', steps: [step('Z-Score:', '' + a), step('CDF:', 'Phi(' + a + ') = ' + cdf.toFixed(6)), step('P-Value:', '' + (b === 1 ? 'One-tailed' : 'Two-tailed') + ' p = ' + pVal.toFixed(6))] }
    },
    formula: 'p = 2 x (1 - Phi(|z|)) for two-tailed',
    description: 'Estimate the p-value from a z-score using the normal distribution.',
    interpretation: 'The p-value is the probability of observing a result as extreme as the test statistic.'
}

export default calcDef

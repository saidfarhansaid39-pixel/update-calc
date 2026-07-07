import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'x value for interpolation')],
    defaults: { a: '2.5' },
    compute: (v) => {
      const x = n(v.a)
      const xVals = [0, 1, 2, 3], yVals = [1, 2, 4, 8]
      const nPts = yVals.length
      const b1 = yVals.map((_, i) => i > 0 ? yVals[i] - yVals[i - 1] : 0)
      const b2 = b1.map((_, i) => i > 1 ? b1[i] - b1[i - 1] : 0)
      const hVal = 1, p = (x - xVals[nPts - 1]) / hVal
      const result = yVals[nPts - 1] + p * b1[nPts - 1] + p * (p + 1) * b2[nPts - 1] / 2
      return { result: result.toFixed(4), label: 'f(' + x + ')', steps: [step('Backward diff b1:', b1.filter(v => v !== 0).join(', ')), step('Backward diff b2:', b2.filter(v => v !== 0).join(', ')), step('Interpolated:', 'f(' + x + ') = ' + result.toFixed(4))] }
    },
    formula: 'Newton backward difference interpolation formula',
    description: 'Interpolate using Newton backward difference formula.',
    interpretation: 'The interpolated value at the given point using backward differences.'
}

export default calcDef

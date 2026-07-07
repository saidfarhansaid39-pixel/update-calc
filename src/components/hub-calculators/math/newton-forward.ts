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
      const d1 = yVals.map((_, i) => i < yVals.length - 1 ? yVals[i + 1] - yVals[i] : 0)
      const d2 = d1.map((_, i) => i < d1.length - 1 ? d1[i + 1] - d1[i] : 0)
      const hVal = 1, p = (x - xVals[0]) / hVal
      const result = yVals[0] + p * d1[0] + p * (p - 1) * d2[0] / 2
      return { result: result.toFixed(4), label: 'f(' + x + ')', steps: [step('Forward diff d1:', d1.filter(v => v !== 0).join(', ')), step('Forward diff d2:', d2.filter(v => v !== 0).join(', ')), step('Interpolated:', 'f(' + x + ') = ' + result.toFixed(4))] }
    },
    formula: 'Newton forward difference interpolation formula',
    description: 'Interpolate using Newton forward difference formula.',
    interpretation: 'The interpolated value at the given point.'
}

export default calcDef

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
      const f01 = (yVals[1] - yVals[0]) / (xVals[1] - xVals[0])
      const f12 = (yVals[2] - yVals[1]) / (xVals[2] - xVals[1])
      const f23 = (yVals[3] - yVals[2]) / (xVals[3] - xVals[2])
      const f012 = (f12 - f01) / (xVals[2] - xVals[0])
      const f123 = (f23 - f12) / (xVals[3] - xVals[1])
      const f0123 = (f123 - f012) / (xVals[3] - xVals[0])
      const result = yVals[0] + (x - xVals[0]) * f01 + (x - xVals[0]) * (x - xVals[1]) * f012 + (x - xVals[0]) * (x - xVals[1]) * (x - xVals[2]) * f0123
      return { result: result.toFixed(4), label: 'f(' + x + ')', steps: [step('Divided diffs:', 'f[0,1]=' + f01.toFixed(2) + ', f[0,1,2]=' + f012.toFixed(2)), step('Interpolated:', 'f(' + x + ') = ' + result.toFixed(4))] }
    },
    formula: 'Newton divided difference interpolation',
    description: 'Interpolate using Newton divided difference formula.',
    interpretation: 'The interpolated value at the given point using divided differences.'
}

export default calcDef

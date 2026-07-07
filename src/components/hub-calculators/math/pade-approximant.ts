import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'x value')],
    defaults: { a: '0.5' },
    compute: (v) => {
      const x = n(v.a)
      const num = 1 + x / 2, den = 1 - x / 2
      const result = num / den
      return { result: result.toFixed(6), label: 'Pade(1,1)', steps: [step('Pade approx:', 'R(x) = (1 + x/2) / (1 - x/2)'), step('At x=' + x + ':', 'R(' + x + ') = ' + result.toFixed(6)), step('Exact ex:', 'exp(' + x + ') = ' + Math.exp(x).toFixed(6))] }
    },
    formula: 'Pade approximant [1/1] for ex: (1 + x/2)/(1 - x/2)',
    description: 'Pade approximant (degree 1/1) for exponential function.',
    interpretation: 'The rational approximation using Pade approximant.'
}

export default calcDef

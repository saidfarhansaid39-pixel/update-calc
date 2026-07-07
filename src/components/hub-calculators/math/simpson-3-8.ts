import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 3 && Number(v) % 3 === 0, 'Multiple of 3 >= 3') }),
    fields: [numField('a', 'Lower bound a'), numField('b', 'Upper bound b'), numField('n', 'Subintervals (mult of 3)', { min: 3, step: '3' })],
    defaults: { a: '0', b: '1', n: '6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), nVal = Math.round(n(v.n)); const h = (b - a) / nVal; let sum = 0
      for (let i = 0; i <= nVal; i++) { const x = a + i * h; const fx = x * x; let coeff = 1; if (i !== 0 && i !== nVal) coeff = (i % 3 === 0) ? 2 : 3; sum += coeff * fx }
      const result = (3 * h / 8) * sum
      return { result: result.toFixed(6), label: 'Simpson 3/8 approx', steps: [step('h', h.toFixed(6)), step('Approx integral', result.toFixed(6))] }
    },
    formula: '?f(x)dx ? 3h/8 � [f(a) + 3S + 2S + f(b)].',
    description: 'Simpson\'s 3/8 rule for numerical integration.',
    interpretation: 'Approximate definite integral using cubic interpolation.'
}

export default calcDef

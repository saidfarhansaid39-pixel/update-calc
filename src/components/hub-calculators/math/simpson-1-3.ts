import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 2 && Number(v) % 2 === 0, 'Even integer >= 2') }),
    fields: [numField('a', 'Lower bound a'), numField('b', 'Upper bound b'), numField('n', 'Subintervals (even)', { min: 2, step: '2' })],
    defaults: { a: '0', b: '1', n: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), nVal = Math.round(n(v.n)); const h = (b - a) / nVal; let sum = 0
      for (let i = 0; i <= nVal; i++) { const x = a + i * h; const fx = x * x; const coeff = (i === 0 || i === nVal) ? 1 : (i % 2 === 1 ? 4 : 2); sum += coeff * fx }
      const result = (h / 3) * sum
      return { result: result.toFixed(6), label: 'Simpson approx', steps: [step('h', h.toFixed(6)), step('Approx integral', result.toFixed(6))] }
    },
    formula: '?f(x)dx ? h/3 � [f(a) + 4Sf(odd) + 2Sf(even) + f(b)].',
    description: 'Simpson\'s 1/3 rule for numerical integration.',
    interpretation: 'Approximate definite integral using quadratic interpolation.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 1000, '1-1000 integer') }),
    fields: [numField('a', 'Lower bound a'), numField('b', 'Upper bound b'), numField('n', 'Subintervals n', { min: 1, max: 1000, step: '1' })],
    defaults: { a: '0', b: '1', n: '10' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), nVal = Math.round(n(v.n)); const h = (b - a) / nVal; let sum = 0
      for (let i = 0; i <= nVal; i++) { const x = a + i * h; const fx = x * x; const coeff = (i === 0 || i === nVal) ? 1 : 2; sum += coeff * fx }
      const result = (h / 2) * sum
      return { result: result.toFixed(6), label: '?x� dx (approx)', steps: [step('h', h.toFixed(6)), step('Approx integral', result.toFixed(6))] }
    },
    formula: '?f(x)dx � h/2 � [f(a) + 2Sf(x?) + f(b)]. Example: f(x) = x�.',
    description: 'Trapezoidal rule for numerical integration.',
    interpretation: 'Approximate definite integral using trapezoids.'
}

export default calcDef

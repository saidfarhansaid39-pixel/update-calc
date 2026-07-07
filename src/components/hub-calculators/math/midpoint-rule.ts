import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1, 'Integer >= 1') }),
    fields: [numField('a', 'Lower bound a'), numField('b', 'Upper bound b'), numField('n', 'Subintervals', { min: 1, step: '1' })],
    defaults: { a: '0', b: '1', n: '10' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), nVal = Math.round(n(v.n)); const dx = (b - a) / nVal; let sum = 0
      for (let i = 0; i < nVal; i++) { const xMid = a + (i + 0.5) * dx; sum += xMid * xMid }
      sum *= dx
      return { result: sum.toFixed(6), label: 'Midpoint approx', steps: [step('dx', dx.toFixed(6)), step('Midpoint sum', sum.toFixed(6))] }
    },
    formula: 'S = S f(x?mid)dx where x?mid = midpoint of each subinterval.',
    description: 'Midpoint rule for numerical integration of f(x) = x^2.',
    interpretation: 'Approximate integral using rectangle heights at interval midpoints.'
}

export default calcDef

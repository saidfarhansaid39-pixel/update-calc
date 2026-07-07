import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Lower bound a'), numField('b', 'Upper bound b')],
    defaults: { a: '0', b: '1' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b); const f = (x: number) => x * x; const R = [[(b - a) / 2 * (f(a) + f(b))]]
      for (let k = 1; k <= 4; k++) { let h = (b - a) / Math.pow(2, k); let sum = 0; for (let i = 1; i <= Math.pow(2, k - 1); i++) sum += f(a + (2 * i - 1) * h); R[k] = [R[k - 1][0] / 2 + h * sum]; for (let j = 1; j <= k; j++) R[k][j] = (Math.pow(4, j) * R[k][j - 1] - R[k - 1][j - 1]) / (Math.pow(4, j) - 1) }
      return { result: R[4][4].toFixed(8), label: '?x� dx', steps: [step('Romberg R(4,4)', R[4][4].toFixed(8))] }
    },
    formula: 'Romberg integration using Richardson extrapolation on trapezoidal rule.',
    description: 'Romberg integration for numerical integration.',
    interpretation: 'High-order accurate integral approximation.'
}

export default calcDef

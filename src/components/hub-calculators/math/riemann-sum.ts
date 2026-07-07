import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1, 'Integer >= 1') }),
    fields: [numField('a', 'Lower bound a'), numField('b', 'Upper bound b'), numField('n', 'Subintervals', { min: 1, step: '1' })],
    defaults: { a: '0', b: '1', n: '10' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), nVal = Math.round(n(v.n)); const dx = (b - a) / nVal; let leftSum = 0, rightSum = 0
      for (let i = 1; i <= nVal; i++) { leftSum += (a + (i - 1) * dx) ** 2; rightSum += (a + i * dx) ** 2 }
      leftSum *= dx; rightSum *= dx
      return { result: leftSum.toFixed(6), label: 'Left Riemann sum', steps: [step('dx', dx.toFixed(6)), step('Left sum', leftSum.toFixed(6)), step('Right sum', rightSum.toFixed(6))] }
    },
    formula: 'S = S f(x?*)dx. Left sum uses left endpoints, right sum uses right endpoints.',
    description: 'Compute left and right Riemann sums for f(x) = x^2.',
    interpretation: 'Riemann sums approximate the definite integral using rectangles.'
}

export default calcDef

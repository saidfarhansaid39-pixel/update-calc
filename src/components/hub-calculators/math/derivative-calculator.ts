import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('x', 'Point x')],
    defaults: { x: '2' },
    compute: (v) => {
      const x = n(v.x); const h = 1e-6; const f = (t: number) => t * t; const fd = (f(x + h) - f(x)) / h; const exact = 2 * x
      return { result: fd.toFixed(6), label: "f'(x) approx", steps: [step('f(x) = x^2', ''), step('Forward diff', fd.toFixed(6)), step('Exact', exact.toFixed(6)), step('Error', Math.abs(fd - exact).toFixed(10))] }
    },
    formula: "f'(x) ? (f(x+h) - f(x))/h for small h.",
    description: 'Numerical derivative of f(x) = x^2 using forward difference.',
    interpretation: 'Approximate rate of change at point x.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), h: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Point a'), numField('h', 'Step size h', { min: 0.0001 })],
    defaults: { a: '1', h: '0.1' },
    compute: (v) => {
      const a = n(v.a), h = n(v.h); const f = (x: number) => x * x; const fd = (f(a + h) - f(a)) / h; const cd = (f(a + h) - f(a - h)) / (2 * h); const bd = (f(a) - f(a - h)) / h; const exact = 2 * a
      return { result: `${fd.toFixed(4)} (forward)`, label: "f'(a)", steps: [step('Exact', exact.toFixed(4)), step('Forward diff', fd.toFixed(6)), step('Central diff', cd.toFixed(6)), step('Backward diff', bd.toFixed(6))] }
    },
    formula: "f'(a) � (f(a+h) - f(a))/h (forward), (f(a+h) - f(a-h))/(2h) (central).",
    description: 'Finite difference approximation of derivatives.',
    interpretation: 'Numerical derivative approximation with forward, central, and backward differences.'
}

export default calcDef

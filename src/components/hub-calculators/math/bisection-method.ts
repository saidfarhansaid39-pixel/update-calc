import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Left endpoint a'), numField('b', 'Right endpoint b')],
    defaults: { a: '0', b: '2' },
    compute: (v) => {
      let a = n(v.a), b = n(v.b); const fa = a * a - 2, fb = b * b - 2; let mid = 0; const steps: { label: string; value: string }[] = [step('f(a)', fa.toFixed(4)), step('f(b)', fb.toFixed(4))]
      if (fa * fb >= 0) return { result: 'No sign change', label: 'Bisection', steps }
      for (let i = 0; i < 20; i++) { mid = (a + b) / 2; const fm = mid * mid - 2; if (fm === 0) break; if (fa * fm < 0) b = mid; else a = mid; if (i < 5) steps.push(step(`Iter ${i + 1}`, `[${a.toFixed(4)}, ${b.toFixed(4)}], mid=${mid.toFixed(6)}`)) }
      return { result: mid.toFixed(10), label: 'Root (v2)', steps }
    },
    formula: 'Bisection on f(x) = x� - 2. Iteratively halve interval containing root.',
    description: 'Bisection method for root finding.',
    interpretation: 'Approximate root found by interval halving.'
}

export default calcDef

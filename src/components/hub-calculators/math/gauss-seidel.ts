import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a1 (coeff x in eq1)'), numField('b', 'b1 (coeff y in eq1)'), numField('c', 'c1 (const eq1)'), numField('d', 'a2 (coeff x in eq2)'), numField('e', 'b2 (coeff y in eq2)'), numField('f', 'c2 (const eq2)')],
    defaults: { a: '4', b: '1', c: '9', d: '1', e: '3', f: '7' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d), e = n(v.e), f = n(v.f)
      let x = 0, y = 0; const steps: { label: string; value: string }[] = []
      for (let i = 0; i < 5; i++) { x = (c - b * y) / a; y = (f - d * x) / e; steps.push(step(`Iter ${i + 1}`, `x=${x.toFixed(4)}, y=${y.toFixed(4)}`)) }
      return { result: `x=${x.toFixed(6)}, y=${y.toFixed(6)}`, label: 'Solution', steps }
    },
    formula: 'x = (c - by)/a, y = (f - dx)/e. Iterative Gauss-Seidel.',
    description: 'Gauss-Seidel iterative method for linear systems.',
    interpretation: 'Iterative solution to system of linear equations.'
}

export default calcDef

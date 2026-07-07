import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('c', 'RHS constant')],
    defaults: { a: '4', b: '1', c: '9' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c); let x = 0, r = c - a * x, p = r; const steps: { label: string; value: string }[] = []
      for (let i = 0; i < 3; i++) { const Ap = a * p; const alpha = r * r / (p * Ap); x += alpha * p; const rn = r - alpha * Ap; const beta = rn * rn / (r * r); p = rn + beta * p; r = rn; steps.push(step(`Iter ${i + 1}`, `x=${x.toFixed(4)}, residual=${r.toFixed(6)}`)) }
      return { result: x.toFixed(6), label: 'Solution x', steps }
    },
    formula: 'CG method for Ax = b. Iterative solver for SPD matrices.',
    description: 'Conjugate gradient method (simplified 1D).',
    interpretation: 'Iterative solution for symmetric positive-definite systems.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a1 (first eqn, x)'), numField('b', 'b1 (first eqn, y)'), numField('c', 'c1 (first eqn, constant)'), numField('d', 'a2 (second eqn, x)', { mode: 'advanced' }), numField('e', 'b2 (second eqn, y)', { mode: 'advanced' }), numField('f', 'c2 (second eqn, constant)', { mode: 'advanced' })],
    defaults: { a: '2', b: '3', c: '7', d: '5', e: '-1', f: '9' },
    compute: (v) => {
      const a1 = n(v.a), b1 = n(v.b), c1 = n(v.c), a2 = n(v.d), b2 = n(v.e), c2 = n(v.f)
      const det = a1 * b2 - a2 * b1
      if (Math.abs(det) < 1e-10) return { result: 'No unique solution (parallel or coincident)', label: 'Error' }
      const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det
      return { result: 'x = ' + x.toFixed(4) + ', y = ' + y.toFixed(4), label: 'Solution', steps: [step('System:', '' + a1 + 'x + ' + b1 + 'y = ' + c1 + ' and ' + a2 + 'x + ' + b2 + 'y = ' + c2), step('Determinant:', 'D = ' + a1 + 'x' + b2 + ' - ' + a2 + 'x' + b1 + ' = ' + det.toFixed(4)), step('x:', '(' + c1 + 'x' + b2 + ' - ' + c2 + 'x' + b1 + ') / ' + det.toFixed(4) + ' = ' + x.toFixed(4)), step('y:', '(' + a1 + 'x' + c2 + ' - ' + a2 + 'x' + c1 + ') / ' + det.toFixed(4) + ' = ' + y.toFixed(4))], extras: [{ label: 'Determinant', value: det }] }
    },
    formula: 'Cramer rule: x = (c1b2 - c2b1)/det, y = (a1c2 - a2c1)/det',
    description: 'Solve a system of two linear equations with two unknowns.',
    interpretation: 'The (x, y) solution of the system of equations.'
}

export default calcDef

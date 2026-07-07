import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (top-left)'), numField('b', 'b (top-right)'), numField('c', 'c (bottom-left)'), numField('d', 'd (bottom-right)')],
    defaults: { a: '2', b: '1', c: '1', d: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d); const trace = a + d; const det = a * d - b * c
      const disc = trace * trace - 4 * det
      if (disc < 0) return { result: 'Complex eigenvalues', label: 'Eigenvalues', steps: [step('Trace', '' + trace), step('Determinant', '' + det), step('Discriminant', 'Negative � complex')] }
      const l1 = (trace + Math.sqrt(disc)) / 2; const l2 = (trace - Math.sqrt(disc)) / 2
      return { result: `${l1.toFixed(4)}, ${l2.toFixed(4)}`, label: 'Eigenvalues', steps: [step('Characteristic eq', `?� - ${trace}? + ${det} = 0`), step('?1', l1.toFixed(4)), step('?2', l2.toFixed(4))] }
    },
    formula: 'det(A - ?I) = 0 ? ?� - tr(A)? + det(A) = 0.',
    description: 'Calculate eigenvalues of a 2x2 matrix.',
    interpretation: 'Eigenvalues satisfy Av = ?v for eigenvectors v.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (top-left)'), numField('b', 'b (top-right)'), numField('c', 'c (bottom-left)'), numField('d', 'd (bottom-right)')],
    defaults: { a: '2', b: '1', c: '1', d: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d); const trace = a + d; const det = a * d - b * c; const disc = trace * trace - 4 * det
      if (disc < 0) return { result: 'Complex eigenvectors', label: 'Eigenvectors', steps: [step('Complex ?', 'Eigenvectors complex')] }
      const l1 = (trace + Math.sqrt(disc)) / 2; const l2 = (trace - Math.sqrt(disc)) / 2
      const v1x = b, v1y = l1 - a; const v2x = b, v2y = l2 - a
      return { result: `v1=(${v1x.toFixed(4)}, ${v1y.toFixed(4)}), v2=(${v2x.toFixed(4)}, ${v2y.toFixed(4)})`, label: 'Eigenvectors', steps: [step('?1', l1.toFixed(4)), step('v1', `(${v1x.toFixed(4)}, ${v1y.toFixed(4)})`), step('?2', l2.toFixed(4)), step('v2', `(${v2x.toFixed(4)}, ${v2y.toFixed(4)})`)] }
    },
    formula: '(A - ?I)v = 0. For 2x2, v = (b, ? - a).',
    description: 'Calculate eigenvectors of a 2x2 matrix.',
    interpretation: 'Eigenvectors are non-zero vectors that only scale under transformation.'
}

export default calcDef

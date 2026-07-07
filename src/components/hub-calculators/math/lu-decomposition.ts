import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (top-left)'), numField('b', 'b (top-right)'), numField('c', 'c (bottom-left)'), numField('d', 'd (bottom-right)')],
    defaults: { a: '4', b: '3', c: '6', d: '3' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const l11 = 1, l21 = c / a; const u11 = a, u12 = b, u22 = d - l21 * b
      return { result: `L=[[1,0],[${l21.toFixed(4)},1]], U=[[${u11.toFixed(4)},${u12.toFixed(4)}],[0,${u22.toFixed(4)}]]`, label: 'LU Decomposition', steps: [step('L', `[[1, 0], [${l21.toFixed(4)}, 1]]`), step('U', `[[${u11.toFixed(4)}, ${u12.toFixed(4)}], [0, ${u22.toFixed(4)}]]`)] }
    },
    formula: 'A = LU. L lower triangular, U upper triangular.',
    description: 'Compute LU decomposition of a 2x2 matrix.',
    interpretation: 'LU decomposition factors A into lower and upper triangular matrices.'
}

export default calcDef

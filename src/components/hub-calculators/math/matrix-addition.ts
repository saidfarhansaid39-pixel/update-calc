import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a11: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), a12: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), a21: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), a22: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b11: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b12: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b21: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b22: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a11', 'A11'), numField('a12', 'A12'), numField('a21', 'A21'), numField('a22', 'A22'), numField('b11', 'B11'), numField('b12', 'B12'), numField('b21', 'B21'), numField('b22', 'B22')],
    defaults: { a11: '1', a12: '2', a21: '3', a22: '4', b11: '5', b12: '6', b21: '7', b22: '8' },
    compute: (v) => {
      const a11 = n(v.a11), a12 = n(v.a12), a21 = n(v.a21), a22 = n(v.a22)
      const b11 = n(v.b11), b12 = n(v.b12), b21 = n(v.b21), b22 = n(v.b22)
      return { result: `[[${a11 + b11}, ${a12 + b12}], [${a21 + b21}, ${a22 + b22}]]`, label: 'A + B', steps: [step('Matrix A', `[[${a11},${a12}],[${a21},${a22}]]`), step('Matrix B', `[[${b11},${b12}],[${b21},${b22}]]`), step('Sum', `[[${a11 + b11},${a12 + b12}],[${a21 + b21},${a22 + b22}]]`)] }
    },
    formula: '(A + B)ij = Aij + Bij.',
    description: 'Add two 2x2 matrices together.',
    interpretation: 'Element-wise sum of the two matrices.'
}

export default calcDef

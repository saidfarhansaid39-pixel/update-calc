import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (col1-row1)'), numField('b', 'b (col1-row2)'), numField('c', 'c (col2-row1)'), numField('d', 'd (col2-row2)')],
    defaults: { a: '3', b: '4', c: '0', d: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const n1 = Math.sqrt(a * a + b * b); const q11 = a / n1, q21 = b / n1
      const r11 = n1, r12 = (q11 * c + q21 * d)
      const q12 = c - r12 * q11, q22 = d - r12 * q21; const n2 = Math.sqrt(q12 * q12 + q22 * q22)
      const q12n = q12 / n2, q22n = q22 / n2; const r22 = n2
      return { result: `Q=[[${q11.toFixed(4)},${q12n.toFixed(4)}],[${q21.toFixed(4)},${q22n.toFixed(4)}]]`, label: 'QR', steps: [step('Q', `[[${q11.toFixed(4)}, ${q12n.toFixed(4)}], [${q21.toFixed(4)}, ${q22n.toFixed(4)}]]`), step('R', `[[${r11.toFixed(4)}, ${r12.toFixed(4)}], [0, ${r22.toFixed(4)}]]`)] }
    },
    formula: 'A = QR. Q orthogonal, R upper triangular.',
    description: 'Compute QR decomposition of a 2x2 matrix.',
    interpretation: 'QR decomposition factors A into an orthogonal Q and upper triangular R.'
}

export default calcDef

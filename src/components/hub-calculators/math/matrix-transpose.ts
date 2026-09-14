import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (top-left)'), numField('b', 'b (top-right)'), numField('c', 'c (bottom-left)'), numField('d', 'd (bottom-right)')],
    defaults: { a: '1', b: '2', c: '3', d: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      return { result: `[[${a}, ${c}], [${b}, ${d}]]`, label: 'A^T', steps: [step('Original', `[[${a},${b}],[${c},${d}]]`), step('Transpose', `[[${a},${c}],[${b},${d}]]`)] ,
    extras: [
      { label: "Dimension Check", value: "Matrix dimensions must be compatible for the operation." },
      { label: "Singular Matrix Warning", value: "A determinant of zero means the matrix has no inverse." },
      { label: "Computational Complexity", value: "Larger matrices require significantly more computation." },
      { label: "Application", value: "Used in computer graphics, machine learning, and physics simulations." }
    ]}
    },
    formula: '(A^T)ij = Aji.',
    description: 'Calculate the transpose of a 2x2 matrix.',
    interpretation: 'Rows become columns and columns become rows.',
    presets: [
      { label: 'Example', values: { a: '1', b: '0', c: '0', d: '1' } }
    ]
}

export default calcDef

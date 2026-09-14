import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a11'), numField('b', 'a12'), numField('c', 'a21'), numField('d', 'a22')],
    defaults: { a: '1', b: '2', c: '3', d: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const det = a * d - b * c
      return { result: det, label: 'determinant', steps: [step('Formula:', 'det = ad - bc = ' + a + ' x ' + d + ' - ' + b + ' x ' + c), step('Result:', 'det = ' + det)] ,
    extras: [
      { label: "Dimension Check", value: "Matrix dimensions must be compatible for the operation." },
      { label: "Singular Matrix Warning", value: "A determinant of zero means the matrix has no inverse." },
      { label: "Computational Complexity", value: "Larger matrices require significantly more computation." },
      { label: "Application", value: "Used in computer graphics, machine learning, and physics simulations." }
    ]}
    },
    formula: 'det([[a, b], [c, d]]) = ad - bc',
    description: 'Calculate the determinant of a 2x2 matrix.',
    interpretation: 'The determinant value of the 2x2 matrix.',
    presets: [
      { label: 'Example', values: { a: '1', b: '0', c: '0', d: '1' } }
    ]
}

export default calcDef

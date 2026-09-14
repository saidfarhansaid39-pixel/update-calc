import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), g: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), h: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a11 (A)'), numField('b', 'a12 (A)'), numField('c', 'a21 (A)'), numField('d', 'a22 (A)'), numField('e', 'b11 (B)'), numField('f', 'b12 (B)'), numField('g', 'b21 (B)'), numField('h', 'b22 (B)')],
    defaults: { a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d), e = n(v.e), f = n(v.f), g = n(v.g), h = n(v.h)
      return { result: '[' + (a + e) + ', ' + (b + f) + '; ' + (c + g) + ', ' + (d + h) + ']', label: 'A + B', steps: [step('Sum:', '[' + (a + e) + ', ' + (b + f) + '; ' + (c + g) + ', ' + (d + h) + ']')] ,
    extras: [
      { label: "Dimension Check", value: "Matrix dimensions must be compatible for the operation." },
      { label: "Singular Matrix Warning", value: "A determinant of zero means the matrix has no inverse." },
      { label: "Computational Complexity", value: "Larger matrices require significantly more computation." },
      { label: "Application", value: "Used in computer graphics, machine learning, and physics simulations." }
    ]}
    },
    formula: 'A + B',
    description: 'Add two 2x2 matrices.',
    interpretation: 'The sum of the two matrices.',
    presets: [
      { label: 'Example', values: { a: '1', b: '0', c: '0', d: '1' } }
    ]
}

export default calcDef

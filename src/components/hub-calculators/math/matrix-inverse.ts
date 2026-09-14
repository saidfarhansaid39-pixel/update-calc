import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a11'), numField('b', 'a12'), numField('c', 'a21'), numField('d', 'a22')],
    defaults: { a: '4', b: '3', c: '2', d: '1' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const det = a * d - b * c
      if (det === 0) return { result: 'Matrix is singular (det=0)', label: 'No inverse' }
      const invA = d / det, invB = -b / det, invC = -c / det, invD = a / det
      return { result: '[' + invA.toFixed(4) + ', ' + invB.toFixed(4) + '; ' + invC.toFixed(4) + ', ' + invD.toFixed(4) + ']', label: 'Inverse matrix', steps: [step('Determinant:', 'det = ' + det), step('Inverse:', '1/' + det + ' x [' + d + ', -' + b + '; -' + c + ', ' + a + ']')],
    extras: [
      { label: "Dimension Check", value: "Matrix dimensions must be compatible for the operation." },
      { label: "Singular Matrix Warning", value: "A determinant of zero means the matrix has no inverse." },
      { label: "Computational Complexity", value: "Larger matrices require significantly more computation." },
      { label: "Application", value: "Used in computer graphics, machine learning, and physics simulations." }
    ] }
    },
    formula: 'A^-1 = 1/det(A) x [[d, -b], [-c, a]]',
    description: 'Calculate the inverse of a 2x2 matrix.',
    interpretation: 'The inverse of the given 2x2 matrix.',
    presets: [
      { label: 'Example', values: { a: '1', b: '0', c: '0', d: '1' } }
    ]
}

export default calcDef

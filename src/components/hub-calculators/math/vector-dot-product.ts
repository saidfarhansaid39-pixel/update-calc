import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ ax: z.string().min(1), ay: z.string().min(1), bx: z.string().min(1), by: z.string().min(1) }),
    fields: [numField('ax', 'v1.x'), numField('ay', 'v1.y'), numField('bx', 'v2.x'), numField('by', 'v2.y')],
    defaults: { ax: '3', ay: '4', bx: '1', by: '2' },
    compute: (v) => {
      const ax = n(v.ax), ay = n(v.ay), bx = n(v.bx), by = n(v.by)
      const result = ax * bx + ay * by
      return { result, label: 'v1 . v2', steps: [step('Formula:', '(' + ax + ')(' + bx + ') + (' + ay + ')(' + by + ')'), step('Result:', '' + result)] ,
    extras: [
      { label: "Dimension Check", value: "Matrix dimensions must be compatible for the operation." },
      { label: "Singular Matrix Warning", value: "A determinant of zero means the matrix has no inverse." },
      { label: "Computational Complexity", value: "Larger matrices require significantly more computation." },
      { label: "Application", value: "Used in computer graphics, machine learning, and physics simulations." }
    ]}
    },
    formula: 'v . w = vx*wx + vy*wy',
    description: 'Calculate the dot product of two 2D vectors.',
    interpretation: 'The sum of the products of corresponding components.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

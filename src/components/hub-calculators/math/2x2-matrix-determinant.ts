import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1), b: z.string().min(1), c: z.string().min(1), d: z.string().min(1) }),
    fields: [numField('a', 'a (row1,col1)'), numField('b', 'b (row1,col2)'), numField('c', 'c (row2,col1)'), numField('d', 'd (row2,col2)')],
    defaults: { a: '1', b: '2', c: '3', d: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const result = a * d - b * c
      return { result, label: 'det(A)', steps: [step('Formula:', 'det = ad - bc'), step('Values:', '(' + a + ')(' + d + ') - (' + b + ')(' + c + ')'), step('Result:', '' + result)] ,
    extras: [
      { label: "How It Works", value: "Performs the calculation step by step using standard formulas." },
      { label: "Common Use Case", value: "Used when you need a quick and accurate mathematical result." },
      { label: "Input Requirements", value: "Ensure all inputs are valid numbers within acceptable ranges." },
      { label: "Accuracy Note", value: "Floating point precision may affect results at extreme values." }
    ]}
    },
    formula: 'det = ad - bc for 2x2 matrix [[a,b],[c,d]]',
    description: 'Calculate the determinant of a 2x2 matrix.',
    interpretation: 'The determinant value of the 2x2 matrix.',
    presets: [
      { label: 'Identity', values: { a: '1', b: '0', c: '0', d: '1' } },
      { label: 'Integer', values: { a: '1', b: '2', c: '3', d: '4' } }
    ]
}

export default calcDef

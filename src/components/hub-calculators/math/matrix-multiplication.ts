import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1), b: z.string().min(1), c: z.string().min(1), d: z.string().min(1), e: z.string().min(1), f: z.string().min(1), g: z.string().min(1), h: z.string().min(1) }),
    fields: [numField('a', 'A11'), numField('b', 'A12'), numField('c', 'A21'), numField('d', 'A22'), numField('e', 'B11'), numField('f', 'B12'), numField('g', 'B21'), numField('h', 'B22')],
    defaults: { a: '1', b: '2', c: '3', d: '4', e: '2', f: '0', g: '1', h: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const e = n(v.e), f = n(v.f), g = n(v.g), h = n(v.h)
      const r11 = a * e + b * g, r12 = a * f + b * h
      const r21 = c * e + d * g, r22 = c * f + d * h
      const resultStr = '[[' + r11 + ',' + r12 + '],[' + r21 + ',' + r22 + ']]'
      return { result: resultStr, label: 'A x B', steps: [step('Matrix A:', '[[' + a + ',' + b + '],[' + c + ',' + d + ']]'), step('Matrix B:', '[[' + e + ',' + f + '],[' + g + ',' + h + ']]'), step('Result:', resultStr)] }
    },
    formula: '2x2 matrix multiplication',
    description: 'Multiply two 2x2 matrices together.',
    interpretation: 'The product of the two matrices.'
}

export default calcDef

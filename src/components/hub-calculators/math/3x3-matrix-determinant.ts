import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1), b: z.string().min(1), c: z.string().min(1), d: z.string().min(1), e: z.string().min(1), f: z.string().min(1), g: z.string().min(1), h: z.string().min(1), i: z.string().min(1) }),
    fields: [numField('a', 'a'), numField('b', 'b'), numField('c', 'c'), numField('d', 'd'), numField('e', 'e'), numField('f', 'f'), numField('g', 'g'), numField('h', 'h'), numField('i', 'i')],
    defaults: { a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d), e = n(v.e), f = n(v.f), g = n(v.g), h = n(v.h), i = n(v.i)
      const result = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
      return { result, label: 'det(A)', steps: [step('Formula:', 'det = a(ei - fh) - b(di - fg) + c(dh - eg)'), step('Result:', '' + result)] ,
    extras: [
      { label: "How It Works", value: "Performs the calculation step by step using standard formulas." },
      { label: "Common Use Case", value: "Used when you need a quick and accurate mathematical result." },
      { label: "Input Requirements", value: "Ensure all inputs are valid numbers within acceptable ranges." },
      { label: "Accuracy Note", value: "Floating point precision may affect results at extreme values." }
    ]}
    },
    formula: 'det = a(ei - fh) - b(di - fg) + c(dh - eg) for 3x3 matrix',
    description: 'Calculate the determinant of a 3x3 matrix.',
    interpretation: 'The determinant value of the 3x3 matrix.',
    presets: [
      { label: 'Identity', values: { a: '1', b: '0', c: '0', d: '0', e: '1', f: '0', g: '0', h: '0', i: '1' } },
      { label: 'Simple', values: { a: '1', b: '2', c: '3', d: '0', e: '1', f: '4', g: '5', h: '6', i: '0' } }
    ]
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Side a'), numField('b', 'Angle B (degrees)'), numField('c', 'Side b (optional)', { placeholder: '0 to skip' })],
    defaults: { a: '5', b: '30', c: '7' },
    compute: (v) => {
      const a = n(v.a), angleB = n(v.b)
      const bRad = angleB * (Math.PI / 180)
      const ratio = a / Math.sin(bRad)
      return { result: ratio.toFixed(4), label: 'a/sin(A) ratio', steps: [step('Law of sines:', 'a/sin(A) = b/sin(B) = c/sin(C)'), step('Ratio:', '' + ratio.toFixed(4))] ,
    extras: [
      { label: "How It Works", value: "Performs the calculation step by step using standard formulas." },
      { label: "Common Use Case", value: "Used when you need a quick and accurate mathematical result." },
      { label: "Input Requirements", value: "Ensure all inputs are valid numbers within acceptable ranges." },
      { label: "Accuracy Note", value: "Floating point precision may affect results at extreme values." }
    ]}
    },
    formula: 'a/sin(A) = b/sin(B) = c/sin(C)',
    description: 'Apply the law of sines for triangle solving.',
    interpretation: 'The constant ratio in a triangle using law of sines.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

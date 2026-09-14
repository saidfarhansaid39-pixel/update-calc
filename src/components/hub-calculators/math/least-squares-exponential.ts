import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'x value'), numField('b', 'y value')],
    defaults: { a: '1', b: '2' },
    compute: (v) => {
      const x = n(v.a), y = n(v.b)
      const lny = Math.log(Math.abs(y) || 1)
      return { result: 'ln(y) = ' + lny.toFixed(4), label: 'Least squares exp', steps: [step('Transform:', 'ln(y) = ' + lny.toFixed(4) + ' at x=' + x), step('Note:', 'Enter 2+ points for full regression')] ,
    extras: [
      { label: "How It Works", value: "Performs the calculation step by step using standard formulas." },
      { label: "Common Use Case", value: "Used when you need a quick and accurate mathematical result." },
      { label: "Input Requirements", value: "Ensure all inputs are valid numbers within acceptable ranges." },
      { label: "Accuracy Note", value: "Floating point precision may affect results at extreme values." }
    ]}
    },
    formula: 'y = a*e^(bx), minimize sum (ln(yi) - ln(a) - bxi)2',
    description: 'Least squares exponential regression (single point preview).',
    interpretation: 'The transformed value for exponential regression.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'x value'), numField('b', 'y value')],
    defaults: { a: '1', b: '2' },
    compute: (v) => {
      const x = n(v.a), y = n(v.b)
      return { result: 'y=' + y + ' at x=' + x, label: 'Point', steps: [step('Parabola:', 'y = a + bx + cx2'), step('Note:', 'Enter 3+ points for full quadratic regression')] ,
    extras: [
      { label: "How It Works", value: "Performs the calculation step by step using standard formulas." },
      { label: "Common Use Case", value: "Used when you need a quick and accurate mathematical result." },
      { label: "Input Requirements", value: "Ensure all inputs are valid numbers within acceptable ranges." },
      { label: "Accuracy Note", value: "Floating point precision may affect results at extreme values." }
    ]}
    },
    formula: 'y = a + bx + cx2 (quadratic least squares)',
    description: 'Least squares parabolic regression (single point preview).',
    interpretation: 'Data point for parabolic regression.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

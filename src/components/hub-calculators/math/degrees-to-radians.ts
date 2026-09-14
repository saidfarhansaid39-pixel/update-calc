import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '180' },
    compute: (v) => {
      const deg = n(v.a)
      const rad = deg * (Math.PI / 180)
      return { result: rad.toFixed(6), label: 'Radians', steps: [step('Formula:', rad.toFixed(6) + ' = ' + deg + ' x pi/180'), step('Result:', '' + deg + 'deg = ' + rad.toFixed(6) + ' rad')] ,
    extras: [
      { label: "How It Works", value: "Performs the calculation step by step using standard formulas." },
      { label: "Common Use Case", value: "Used when you need a quick and accurate mathematical result." },
      { label: "Input Requirements", value: "Ensure all inputs are valid numbers within acceptable ranges." },
      { label: "Accuracy Note", value: "Floating point precision may affect results at extreme values." }
    ]}
    },
    formula: 'rad = deg x pi/180',
    description: 'Convert degrees to radians.',
    interpretation: 'The angle expressed in radians.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Math.abs(parseFloat(v)) < 1, 'Must be |x| < 1') }),
    fields: [numField('a', 'Value (|x| < 1)')],
    defaults: { a: '0.5' },
    compute: (v) => {
      const val = n(v.a); const result = Math.atanh(val)
      return { result: result.toFixed(6), label: 'atanh(x)', steps: [step('Formula', 'atanh(x) = 1/2 � ln((1+x)/(1-x))'), step('Result', result.toFixed(6))] ,
    extras: [
      { label: "Unit Circle Reference", value: "Angles measured from positive x-axis counterclockwise." },
      { label: "Common Angle Values", value: "sin(0°)=0, sin(30°)=0.5, sin(45°)=0.707, sin(60°)=0.866, sin(90°)=1." },
      { label: "Pythagorean Identity", value: "sin²θ + cos²θ = 1 — fundamental trigonometric relationship." },
      { label: "Radian vs Degree", value: "Switch between degree and radian mode depending on your problem." },
      { label: "Periodic Nature", value: "Trigonometric functions repeat every 360° (2π radians)." }
    ]}
    },
    formula: 'atanh(x) = 1/2 � ln((1+x)/(1-x))',
    description: 'Calculate the inverse hyperbolic tangent (artanh) of a value.',
    interpretation: 'The value whose hyperbolic tangent equals the input.',
    presets: [
      { label: 'Common 30°', values: { a: '30' } },
      { label: 'Common 45°', values: { a: '45' } },
      { label: 'Common 60°', values: { a: '60' } }
    ]
}

export default calcDef

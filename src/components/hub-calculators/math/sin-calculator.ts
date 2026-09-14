import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '30' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      return { result: Math.sin(rad), label: 'sin(theta)', steps: [step('Convert:', deg + 'deg = ' + rad.toFixed(6) + ' rad'), step('Result:', 'sin(' + deg + 'deg) = ' + Math.sin(rad).toFixed(6))] ,
    extras: [
      { label: "Unit Circle Reference", value: "Angles measured from positive x-axis counterclockwise." },
      { label: "Common Angle Values", value: "sin(0°)=0, sin(30°)=0.5, sin(45°)=0.707, sin(60°)=0.866, sin(90°)=1." },
      { label: "Pythagorean Identity", value: "sin²θ + cos²θ = 1 — fundamental trigonometric relationship." },
      { label: "Radian vs Degree", value: "Switch between degree and radian mode depending on your problem." },
      { label: "Periodic Nature", value: "Trigonometric functions repeat every 360° (2π radians)." }
    ]}
    },
    formula: 'sin(theta)',
    description: 'Calculate the sine of an angle.',
    interpretation: 'The sine of the given angle in degrees.',
    presets: [
      { label: 'Common 30°', values: { a: '30' } },
      { label: 'Common 45°', values: { a: '45' } },
      { label: 'Common 60°', values: { a: '60' } }
    ]
}

export default calcDef

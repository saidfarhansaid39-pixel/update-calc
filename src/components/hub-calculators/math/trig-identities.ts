import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '30' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const sin = Math.sin(rad), cos = Math.cos(rad)
      const sin2 = sin * sin, cos2 = cos * cos
      const identity1 = sin2 + cos2
      return { result: identity1.toFixed(6), label: 'sin2 + cos2', steps: [step('sin(' + deg + ')2', '' + sin2.toFixed(6)), step('cos(' + deg + ')2', '' + cos2.toFixed(6)), step('sin2 + cos2 = ' + identity1.toFixed(6), identity1 === 1 ? 'Identity holds (sin2 + cos2 = 1)' : 'Deviation: ' + (identity1 - 1).toFixed(6))] ,
    extras: [
      { label: "Unit Circle Reference", value: "Angles measured from positive x-axis counterclockwise." },
      { label: "Common Angle Values", value: "sin(0°)=0, sin(30°)=0.5, sin(45°)=0.707, sin(60°)=0.866, sin(90°)=1." },
      { label: "Pythagorean Identity", value: "sin²θ + cos²θ = 1 — fundamental trigonometric relationship." },
      { label: "Radian vs Degree", value: "Switch between degree and radian mode depending on your problem." },
      { label: "Periodic Nature", value: "Trigonometric functions repeat every 360° (2π radians)." }
    ]}
    },
    formula: 'sin2(x) + cos2(x) = 1',
    description: 'Verify trigonometric identities for a given angle.',
    interpretation: 'Verification of the Pythagorean trigonometric identity.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

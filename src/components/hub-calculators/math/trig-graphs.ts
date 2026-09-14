import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '45' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const sin = Math.sin(rad), cos = Math.cos(rad), tan = Math.tan(rad)
      return { result: sin.toFixed(6) + ', ' + cos.toFixed(6) + ', ' + (Math.abs(tan) > 1e10 ? 'undefined' : tan.toFixed(6)), label: 'sin, cos, tan', steps: [step('sin(' + deg + ')', '' + sin.toFixed(6)), step('cos(' + deg + ')', '' + cos.toFixed(6)), step('tan(' + deg + ')', '' + (Math.abs(tan) > 1e10 ? 'undefined' : tan.toFixed(6)))] ,
    extras: [
      { label: "Unit Circle Reference", value: "Angles measured from positive x-axis counterclockwise." },
      { label: "Common Angle Values", value: "sin(0°)=0, sin(30°)=0.5, sin(45°)=0.707, sin(60°)=0.866, sin(90°)=1." },
      { label: "Pythagorean Identity", value: "sin²θ + cos²θ = 1 — fundamental trigonometric relationship." },
      { label: "Radian vs Degree", value: "Switch between degree and radian mode depending on your problem." },
      { label: "Periodic Nature", value: "Trigonometric functions repeat every 360° (2π radians)." }
    ]}
    },
    formula: 'sin(x), cos(x), tan(x) evaluated at given angle.',
    description: 'Evaluate trigonometric functions for graphing reference.',
    interpretation: 'The sin, cos, and tan values for the given angle.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'x-coordinate'), numField('b', 'y-coordinate')],
    defaults: { a: '3', b: '4' },
    compute: (v) => {
      const x = n(v.a), y = n(v.b)
      const grad = Math.atan2(y, x)
      return { result: grad.toFixed(4) + ' rad (' + (grad * 180 / Math.PI).toFixed(2) + ' deg)', label: 'Gradient direction', steps: [step('Formula:', 'grad = arctan(y/x)'), step('Result:', 'Direction: ' + (grad * 180 / Math.PI).toFixed(2) + ' degrees from x-axis')] ,
    extras: [
      { label: "Convergence Check", value: "Ensure the method converges for your specific problem parameters." },
      { label: "Error Bound", value: "Numerical methods have inherent approximation error — smaller steps reduce it." },
      { label: "Step Size Impact", value: "Smaller step sizes improve accuracy but increase computation time." },
      { label: "Real Applications", value: "Used in physics, engineering, and economics for dynamic systems." },
      { label: "Numerical vs Analytical", value: "Numerical methods approximate; analytical solutions are exact." }
    ]}
    },
    formula: 'grad f = (df/dx)i + (df/dy)j',
    description: 'Calculate the gradient direction of a scalar field (2D).',
    interpretation: 'The direction of steepest ascent from the given point.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

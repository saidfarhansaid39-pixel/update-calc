import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ ax: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), ay: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('ax', 'x-component'), numField('ay', 'y-component')],
    defaults: { ax: '3', ay: '4' },
    compute: (v) => {
      const ax = n(v.ax), ay = n(v.ay); const mag = Math.sqrt(ax * ax + ay * ay)
      if (mag === 0) return { result: 'Zero vector cannot be normalized', label: 'Error' }
      return { result: `(${(ax / mag).toFixed(4)}, ${(ay / mag).toFixed(4)})`, label: 'Unit vector', steps: [step('Magnitude', mag.toFixed(4)), step('Unit v', `(${(ax / mag).toFixed(4)}, ${(ay / mag).toFixed(4)})`)],
    extras: [
      { label: "Dimension Check", value: "Matrix dimensions must be compatible for the operation." },
      { label: "Singular Matrix Warning", value: "A determinant of zero means the matrix has no inverse." },
      { label: "Computational Complexity", value: "Larger matrices require significantly more computation." },
      { label: "Application", value: "Used in computer graphics, machine learning, and physics simulations." }
    ] }
    },
    formula: 'u = v / |v| = (vx/|v|, vy/|v|).',
    description: 'Normalize a 2D vector to a unit vector.',
    interpretation: 'A unit vector in the same direction with length 1.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef

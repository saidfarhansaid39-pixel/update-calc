import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Left endpoint a'), numField('b', 'Right endpoint b')],
    defaults: { a: '0', b: '2' },
    compute: (v) => {
      let a = n(v.a), b = n(v.b); const fa = a * a - 2, fb = b * b - 2; let xr = 0
      if (fa * fb >= 0) return { result: 'No sign change', label: 'False Position', steps: [] }
      for (let i = 0; i < 10; i++) { xr = (a * fb - b * fa) / (fb - fa); const fr = xr * xr - 2; if (fa * fr < 0) { b = xr } else { a = xr } }
      return { result: xr.toFixed(10), label: 'Root (v2)', steps: [step('Result', xr.toFixed(10))] }
    },
    formula: 'x? = (a�f(b) - b�f(a))/(f(b) - f(a)). Regula falsi method.',
    description: 'False position (regula falsi) method for root finding.',
    interpretation: 'Bracketing method using linear interpolation.'
}

export default calcDef

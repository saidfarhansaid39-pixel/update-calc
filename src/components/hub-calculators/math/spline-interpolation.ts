import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('x0', 'x0'), numField('y0', 'y0'), numField('x1', 'x1'), numField('y1', 'y1'), numField('x', 'Target x')],
    defaults: { x0: '0', y0: '0', x1: '2', y1: '4', x: '1' },
    compute: (v) => {
      const x0 = n(v.x0), y0 = n(v.y0), x1 = n(v.x1), y1 = n(v.y1), x = n(v.x)
      const t = (x - x0) / (x1 - x0); const y = (2 * t * t * t - 3 * t * t + 1) * y0 + (-2 * t * t * t + 3 * t * t) * y1
      return { result: y.toFixed(4), label: 'Cubic spline', steps: [step('t', t.toFixed(4)), step('S(x)', y.toFixed(4))] }
    },
    formula: 'Cubic Hermite spline interpolation between (x0,y0) and (x1,y1).',
    description: 'Cubic spline interpolation between two points.',
    interpretation: 'Smooth interpolation using cubic Hermite basis.'
}

export default calcDef

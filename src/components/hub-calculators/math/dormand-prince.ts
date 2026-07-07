import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Initial y0'), numField('b', 'Step size h')],
    defaults: { a: '1', b: '0.1' },
    compute: (v) => {
      const y0 = n(v.a), h = n(v.b)
      const k1 = y0, k2 = y0 + h * k1 / 5, k3 = y0 + h * (3 * k1 / 40 + 9 * k2 / 40)
      const y1 = y0 + h * (k1 * 35 / 384 + k3 * 500 / 1113)
      return { result: y1.toFixed(6), label: 'y(' + h.toFixed(2) + ')', steps: [step('RK stages:', 'k1=' + k1.toFixed(4) + ', k2=' + k2.toFixed(4) + ', k3=' + k3.toFixed(4)), step('Result:', 'y1=' + y1.toFixed(6))] }
    },
    formula: 'Dormand-Prince RK5(4) embedded method (simplified)',
    description: 'Dormand-Prince adaptive Runge-Kutta method (one step).',
    interpretation: 'The solution at the next step using Dormand-Prince method.'
}

export default calcDef

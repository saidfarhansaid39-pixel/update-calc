import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Initial y0'), numField('b', 'Step size h')],
    defaults: { a: '1', b: '0.1' },
    compute: (v) => {
      const y0 = n(v.a), h = n(v.b)
      const f0 = y0, f1 = y0 * 1.1
      const y1 = y0 + h * (3 * f1 - f0) / 2
      return { result: y1.toFixed(6), label: 'Adams-Bashforth y1', steps: [step('Formula:', 'y1 = y0 + h(3f1 - f0)/2'), step('Result:', 'y1 = ' + y1.toFixed(6))] }
    },
    formula: 'y_{n+1} = y_n + h(3f_n - f_{n-1})/2',
    description: 'Adams-Bashforth 2-step method (one step).',
    interpretation: 'The approximate solution using Adams-Bashforth method.'
}

export default calcDef

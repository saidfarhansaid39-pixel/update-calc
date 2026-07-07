import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Initial y0'), numField('b', 'Step size h')],
    defaults: { a: '1', b: '0.1' },
    compute: (v) => {
      const y0 = n(v.a), h = n(v.b)
      const f0 = y0, f1 = y0 * 1.1, y1_pred = y0 + h * (3 * f1 - f0) / 2
      const f1_corr = y1_pred
      const y1 = y0 + h * (f1_corr + f0) / 2
      return { result: y1.toFixed(6), label: 'Adams-Moulton y1', steps: [step('Predictor:', 'y1_pred = ' + y1_pred.toFixed(6)), step('Corrector:', 'y1 = ' + y1.toFixed(6))] }
    },
    formula: 'y_{n+1} = y_n + h(f_{n+1} + f_n)/2',
    description: 'Adams-Moulton 1-step implicit method.',
    interpretation: 'The approximate solution using Adams-Moulton corrector.'
}

export default calcDef

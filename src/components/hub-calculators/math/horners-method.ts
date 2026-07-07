import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('x', 'Value of x')],
    defaults: { x: '2' },
    compute: (v) => {
      const x = n(v.x); // Evaluate 2x� + 3x� + 4x + 5 using Horner
      const coeffs = [2, 3, 4, 5]; let result = 0; const steps: { label: string; value: string }[] = []
      for (const c of coeffs) { result = result * x + c; steps.push(step('b' + (coeffs.indexOf(c) === 0 ? '3' : coeffs.indexOf(c) === 1 ? '2' : coeffs.indexOf(c) === 2 ? '1' : '0'), '' + result)) }
      return { result: '' + result, label: 'P(x) = 2x�+3x�+4x+5', steps }
    },
    formula: 'Horner: P(x) = (...((a?x + a??1)x + a??2)x + ...) + a0.',
    description: 'Horner method for efficient polynomial evaluation.',
    interpretation: 'Polynomial value evaluated using nested multiplication.'
}

export default calcDef

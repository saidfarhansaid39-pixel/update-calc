import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1, 'Must be >= 1') }),
    fields: [numField('a', 'Value'), numField('b', 'Significant Figures')],
    defaults: { a: '3.14159', b: '3' },
    compute: (v) => {
      const a = n(v.a), b = Math.round(n(v.b))
      const result = parseFloat(a.toPrecision(b))
      return { result, label: 'Rounded to ' + b + ' sig figs', steps: [step('Original:', '' + a), step('Sig figs:', '' + b), step('Result:', '' + result)] }
    },
    formula: 'Round to n significant figures',
    description: 'Round a number to a specified number of significant figures.',
    interpretation: 'The number rounded to the given number of significant digits.'
}

export default calcDef

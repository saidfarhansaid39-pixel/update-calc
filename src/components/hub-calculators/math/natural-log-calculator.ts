import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Value (x)')],
    defaults: { a: '100' },
    compute: (v) => {
      const a = n(v.a)
      return { result: Math.log(a), label: 'ln(x)', steps: [step('Formula:', 'ln(' + a + ')'), step('Result:', '' + Math.log(a).toFixed(6))] }
    },
    formula: 'ln(x)',
    description: 'Calculate the natural logarithm (base e) of a value.',
    interpretation: 'The exponent to which e must be raised to get the value.'
}

export default calcDef

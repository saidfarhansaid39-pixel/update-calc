import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0')
}),
    fields: [numField('a', 'Side A'), numField('b', 'Side B')],
    defaults: { a: '3', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const c = Math.sqrt(a * a + b * b)
      return { result: c, label: 'Hypotenuse (c)', steps: [step('Theorem:', a + '2 + ' + b + '2 = c2'), step('c2:', '' + (a * a) + ' + ' + (b * b) + ' = ' + (a * a + b * b)), step('c:', 'sqrt(' + (a * a + b * b) + ') = ' + c.toFixed(4))] }
    },
    formula: 'c = sqrt(a2 + b2)',
    description: 'Calculate the hypotenuse of a right triangle using the Pythagorean theorem.',
    interpretation: 'The length of the hypotenuse (longest side) of the right triangle.'
}

export default calcDef

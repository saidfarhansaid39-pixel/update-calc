import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
      b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0')
}),
    fields: [numField('a', 'Side a (leg)'), numField('b', 'Side b (leg)')],
    defaults: { a: '3', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const c = Math.sqrt(a * a + b * b)
      const angleA = (Math.asin(a / c) * 180 / Math.PI)
      const angleB = (Math.asin(b / c) * 180 / Math.PI)
      return { result: c, label: 'Hypotenuse', steps: [step('Pythagorean:', a + '2 + ' + b + '2 = ' + (a * a) + ' + ' + (b * b) + ' = ' + (a * a + b * b)), step('Hypotenuse:', 'c = sqrt(' + (a * a + b * b) + ') = ' + c.toFixed(4))], extras: [{ label: 'Angle A', value: angleA }, { label: 'Angle B', value: angleB }] }
    },
    formula: 'a2 + b2 = c2 (Pythagorean theorem)',
    description: 'Solve a right triangle given two legs.',
    interpretation: 'The hypotenuse and angles of the right triangle with the given leg lengths.'
}

export default calcDef

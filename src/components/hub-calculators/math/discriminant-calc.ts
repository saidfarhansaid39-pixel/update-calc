import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('c', 'Constant c')],
    defaults: { a: '1', b: '-5', c: '6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      const disc = b * b - 4 * a * c
      let nature = 'Two distinct real roots'
      if (disc < 0) nature = 'Two complex roots'
      else if (disc === 0) nature = 'One repeated real root'
      return { result: disc, label: 'Discriminant', steps: [step('Formula:', 'D = ' + b + '2 - 4(' + a + ')(' + c + ')'), step('Result:', 'D = ' + disc), step('Nature:', nature)] }
    },
    formula: 'D = b2 - 4ac',
    description: 'Calculate the discriminant of a quadratic equation.',
    interpretation: 'Determines the nature of roots: D > 0 two real, D = 0 one real, D < 0 complex.'
}

export default calcDef

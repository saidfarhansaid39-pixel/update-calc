import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Center x (h)'), numField('b', 'Center y (k)'), numField('c', 'Radius (r)')],
    defaults: { a: '0', b: '0', c: '5' },
    compute: (v) => {
      const h = n(v.a), k = n(v.b), r = n(v.c)
      return { result: '(x - ' + h + ')2 + (y - ' + k + ')2 = ' + (r * r), label: 'Circle Equation', steps: [step('Standard form:', '(x - h)2 + (y - k)2 = r2'), step('Result:', '(x - ' + h + ')2 + (y - ' + k + ')2 = ' + (r * r))] }
    },
    formula: '(x - h)2 + (y - k)2 = r2',
    description: 'Find the equation of a circle given its center and radius.',
    interpretation: 'The standard form equation of the circle with the given center and radius.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Length (l)'), numField('b', 'Width (w)')],
    defaults: { a: '5', b: '3' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      return { result: a * b, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = ' + a + ' x ' + b + ' = ' + (a * b))] }
    },
    formula: 'A = l x w',
    description: 'Calculate the area of a rectangle.',
    interpretation: 'The area enclosed by a rectangle with the given dimensions.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Semi-major axis (a)'), numField('b', 'Semi-minor axis (b)')],
    defaults: { a: '5', b: '3' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const area = Math.PI * a * b
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Area:', 'A = pi x ' + a + ' x ' + b + ' = ' + area.toFixed(4))] }
    },
    formula: 'A = piab',
    description: 'Calculate the area of an ellipse.',
    interpretation: 'The area enclosed by an ellipse with the given semi-axes.'
}

export default calcDef

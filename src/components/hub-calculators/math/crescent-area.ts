import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius of larger circle (R)'), numField('b', 'Radius of smaller circle (r)')],
    defaults: { a: '5', b: '4' },
    compute: (v) => {
      const R = n(v.a), r = n(v.b)
      const area = Math.PI * (R * R - r * r) / 2
      return { result: area, label: 'Crescent Area', unit: 'units2', steps: [step('Formula:', 'A = 1/2pi(' + R + '2 - ' + r + '2) = ' + area.toFixed(4))] }
    },
    formula: 'A = 1/2pi(R2 - r2)',
    description: 'Calculate the area of a crescent (lune).',
    interpretation: 'The area of the crescent shape formed by two overlapping circles.'
}

export default calcDef

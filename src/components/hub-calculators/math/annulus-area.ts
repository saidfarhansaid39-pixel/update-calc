import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Outer Radius (R)'), numField('b', 'Inner Radius (r)')],
    defaults: { a: '5', b: '3' },
    compute: (v) => {
      const R = n(v.a), r = n(v.b)
      const area = Math.PI * (R * R - r * r)
      return { result: area, label: 'Annulus Area', unit: 'units2', steps: [step('Formula:', 'A = pi(' + R + '2 - ' + r + '2)'), step('Result:', 'A = ' + area.toFixed(4))] }
    },
    formula: 'A = pi(R2 - r2)',
    description: 'Calculate the area of an annulus (ring).',
    interpretation: 'The area between two concentric circles.'
}

export default calcDef

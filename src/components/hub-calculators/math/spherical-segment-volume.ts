import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Height of segment (h)'), numField('b', 'Radius of top base (a)'), numField('c', 'Radius of bottom base (b)')],
    defaults: { a: '3', b: '2', c: '4' },
    compute: (v) => {
      const h = n(v.a), a = n(v.b), b = n(v.c)
      const vol = (Math.PI * h / 6) * (3 * a * a + 3 * b * b + h * h)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = (pix' + h + '/6) x (3x' + a + '2 + 3x' + b + '2 + ' + h + '2)'), step('Result:', 'V = ' + vol.toFixed(4))] }
    },
    formula: 'V = (pih/6)(3a2 + 3b2 + h2)',
    description: 'Calculate the volume of a spherical segment.',
    interpretation: 'The space occupied by a spherical segment (zone) of a sphere.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Base a'), numField('b', 'Base b'), numField('c', 'Height (h)')],
    defaults: { a: '8', b: '5', c: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), h = n(v.c)
      const area = 0.5 * (a + b) * h
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = 1/2 x (' + a + ' + ' + b + ') x ' + h), step('Result:', 'A = ' + area.toFixed(4))] }
    },
    formula: 'A = 1/2(a + b)h',
    description: 'Calculate the area of a trapezoid.',
    interpretation: 'The area enclosed by a trapezoid with the given base lengths and height.'
}

export default calcDef

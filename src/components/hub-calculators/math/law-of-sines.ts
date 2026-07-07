import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Side a'), numField('b', 'Angle A (degrees)'), numField('c', 'Angle B (degrees)')],
    defaults: { a: '10', b: '30', c: '45' },
    compute: (v) => {
      const a = n(v.a), A = n(v.b), B = n(v.c)
      const Arad = A * (Math.PI / 180), Brad = B * (Math.PI / 180)
      const b = (a / Math.sin(Arad)) * Math.sin(Brad)
      return { result: b.toFixed(4), label: 'Side b', steps: [step('Law of Sines:', 'a / sin(A) = b / sin(B)'), step('Substitute:', a + ' / sin(' + A + 'deg) = b / sin(' + B + 'deg)'), step('Solve:', 'b = ' + a + ' x sin(' + B + 'deg) / sin(' + A + 'deg) = ' + b.toFixed(4))] }
    },
    formula: 'a / sin(A) = b / sin(B) = c / sin(C)',
    description: 'Find an unknown side using the law of sines.',
    interpretation: 'The ratio of a side length to the sine of its opposite angle is constant.'
}

export default calcDef

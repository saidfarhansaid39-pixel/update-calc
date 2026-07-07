import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Side a'), numField('b', 'Side b'), numField('c', 'Angle C (degrees)')],
    defaults: { a: '5', b: '6', c: '60' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), Cdeg = n(v.c)
      const Crad = Cdeg * (Math.PI / 180)
      const cSq = a * a + b * b - 2 * a * b * Math.cos(Crad)
      const c = cSq > 0 ? Math.sqrt(cSq) : NaN
      return { result: isNaN(c) ? 'Invalid triangle' : c.toFixed(4), label: 'Side c', steps: [step('Law of Cosines:', 'c2 = a2 + b2 - 2ab x cos(C)'), step('Substitute:', 'c2 = ' + a + '2 + ' + b + '2 - 2x' + a + 'x' + b + 'xcos(' + Cdeg + 'deg)'), step('c2:', 'c2 = ' + (a * a) + ' + ' + (b * b) + ' - ' + (2 * a * b * Math.cos(Crad)).toFixed(4) + ' = ' + cSq.toFixed(4)), step('c:', 'c = sqrt' + (cSq > 0 ? cSq.toFixed(4) : 'N/A') + ' = ' + (isNaN(c) ? 'N/A' : c.toFixed(4)))] }
    },
    formula: 'c2 = a2 + b2 - 2ab x cos(C)',
    description: 'Find an unknown side using the law of cosines.',
    interpretation: 'The law of cosines relates the sides of a triangle to the cosine of one angle.'
}

export default calcDef

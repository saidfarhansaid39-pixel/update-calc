import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '1', b: '2', c: '4', d: '8' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const m = x2 !== x1 ? (y2 - y1) / (x2 - x1) : NaN
      const b = isNaN(m) ? NaN : y1 - m * x1
      return { result: isNaN(m) ? 'x = ' + x1 : m === 0 ? 'y = ' + b : 'y = ' + m + 'x + ' + b, label: 'Line Equation', steps: [step('Slope:', 'm = (' + y2 + ' - ' + y1 + ') / (' + x2 + ' - ' + x1 + ') = ' + (isNaN(m) ? 'undefined' : m.toFixed(4))), step('Y-intercept:', 'b = ' + y1 + ' - ' + (isNaN(m) ? '?' : m.toFixed(4)) + ' x ' + x1 + ' = ' + (isNaN(b) ? '?' : b.toFixed(4)))] }
    },
    formula: 'y = mx + b (two-point form)',
    description: 'Find the equation of a line through two points.',
    interpretation: 'The line equation in slope-intercept form through the two given points.'
}

export default calcDef

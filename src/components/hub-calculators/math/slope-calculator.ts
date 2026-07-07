import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '1', b: '2', c: '4', d: '8' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const slope = x2 !== x1 ? (y2 - y1) / (x2 - x1) : NaN
      return { result: isNaN(slope) ? 'Undefined (vertical)' : slope, label: 'Slope (m)', steps: [step('Formula:', 'm = (' + y2 + ' - ' + y1 + ') / (' + x2 + ' - ' + x1 + ')'), step('Result:', 'm = ' + (isNaN(slope) ? 'undefined (vertical line)' : slope.toFixed(4)))] }
    },
    formula: 'm = (y2 - y1) / (x2 - x1)',
    description: 'Calculate the slope of a line through two points.',
    interpretation: 'The slope measures the steepness and direction of the line.'
}

export default calcDef

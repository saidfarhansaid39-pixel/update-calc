import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Point x1'), numField('b', 'Point y1'), numField('c', 'Slope (m)')],
    defaults: { a: '2', b: '3', c: '4' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), m = n(v.c)
      return { result: 'y - ' + y1 + ' = ' + m + '(x - ' + x1 + ')', label: 'Point-Slope Form', steps: [step('Form:', 'y - y1 = m(x - x1)'), step('Result:', 'y - ' + y1 + ' = ' + m + '(x - ' + x1 + ')')] }
    },
    formula: 'y - y1 = m(x - x1)',
    description: 'Generate the point-slope form of a line.',
    interpretation: 'The line equation in point-slope form using the given point and slope.'
}

export default calcDef

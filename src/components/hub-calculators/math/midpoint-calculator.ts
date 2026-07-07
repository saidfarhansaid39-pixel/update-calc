import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '0', b: '0', c: '6', d: '8' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
      return { result: '(' + mx.toFixed(4) + ', ' + my.toFixed(4) + ')', label: 'Midpoint', steps: [step('Formula:', 'M = ((' + x1 + ' + ' + x2 + ')/2, (' + y1 + ' + ' + y2 + ')/2)'), step('Result:', 'M = (' + mx.toFixed(4) + ', ' + my.toFixed(4) + ')')] }
    },
    formula: 'M = ((x1 + x2)/2, (y1 + y2)/2)',
    description: 'Calculate the midpoint between two points.',
    interpretation: 'The point exactly halfway between the two given points.'
}

export default calcDef

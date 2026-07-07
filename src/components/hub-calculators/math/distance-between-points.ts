import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '0', b: '0', c: '3', d: '4' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
      return { result: d, label: 'Distance', steps: [step('Formula:', 'd = sqrt((' + x2 + ' - ' + x1 + ')2 + (' + y2 + ' - ' + y1 + ')2)'), step('Result:', 'd = sqrt(' + ((x2 - x1) ** 2) + ' + ' + ((y2 - y1) ** 2) + ') = sqrt(' + ((x2 - x1) ** 2 + (y2 - y1) ** 2) + ') = ' + d.toFixed(4))] }
    },
    formula: 'd = sqrt((x2 - x1)2 + (y2 - y1)2)',
    description: 'Calculate the Euclidean distance between two points in 2D space.',
    interpretation: 'The straight-line distance between the two points.'
}

export default calcDef

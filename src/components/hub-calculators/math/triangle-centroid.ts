import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Ax'), numField('b', 'Ay'), numField('c', 'Bx'), numField('d', 'By'), numField('e', 'Cx'), numField('f', 'Cy')],
    defaults: { a: '0', b: '0', c: '4', d: '0', e: '2', f: '6' },
    compute: (v) => {
      const ax = n(v.a), ay = n(v.b), bx = n(v.c), by = n(v.d), cx = n(v.e), cy = n(v.f)
      const gx = (ax + bx + cx) / 3, gy = (ay + by + cy) / 3
      return { result: '(' + gx.toFixed(4) + ', ' + gy.toFixed(4) + ')', label: 'Centroid', steps: [step('Formula:', 'G = ((' + ax + '+' + bx + '+' + cx + ')/3, (' + ay + '+' + by + '+' + cy + ')/3)'), step('Result:', 'G = (' + gx.toFixed(4) + ', ' + gy.toFixed(4) + ')')] }
    },
    formula: 'G = ((x1+x2+x3)/3, (y1+y2+y3)/3)',
    description: 'Calculate the centroid (geometric center) of a triangle.',
    interpretation: 'The centroid is the intersection of the three medians of the triangle.'
}

export default calcDef

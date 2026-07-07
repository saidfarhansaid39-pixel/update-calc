import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Ax'), numField('b', 'Ay'), numField('c', 'Bx'), numField('d', 'By'), numField('e', 'Cx'), numField('f', 'Cy')],
    defaults: { a: '0', b: '0', c: '4', d: '0', e: '2', f: '6' },
    compute: (v) => {
      const ax = n(v.a), ay = n(v.b), bx = n(v.c), by = n(v.d), cx = n(v.e), cy = n(v.f)
      const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
      if (Math.abs(D) < 1e-10) return { result: 'Collinear points', label: 'Error' }
      const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D
      const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D
      return { result: '(' + ux.toFixed(4) + ', ' + uy.toFixed(4) + ')', label: 'Circumcenter', steps: [step('Result:', 'O = (' + ux.toFixed(4) + ', ' + uy.toFixed(4) + ')')] }
    },
    formula: 'Circumcenter via perpendicular bisector intersection',
    description: 'Calculate the circumcenter of a triangle (center of circumscribed circle).',
    interpretation: 'The circumcenter is equidistant from all three vertices of the triangle.'
}

export default calcDef

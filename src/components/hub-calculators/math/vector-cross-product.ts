import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ ax: z.string().min(1), ay: z.string().min(1), az: z.string().min(1), bx: z.string().min(1), by: z.string().min(1), bz: z.string().min(1) }),
    fields: [numField('ax', 'v1.x'), numField('ay', 'v1.y'), numField('az', 'v1.z'), numField('bx', 'v2.x'), numField('by', 'v2.y'), numField('bz', 'v2.z')],
    defaults: { ax: '1', ay: '2', az: '3', bx: '4', by: '5', bz: '6' },
    compute: (v) => {
      const ax = n(v.ax), ay = n(v.ay), az = n(v.az)
      const bx = n(v.bx), by = n(v.by), bz = n(v.bz)
      const rx = ay * bz - az * by, ry = az * bx - ax * bz, rz = ax * by - ay * bx
      const resultStr = '(' + rx + ', ' + ry + ', ' + rz + ')'
      return { result: resultStr, label: 'v1 x v2', steps: [step('Formula:', 'v x w = (v2w3 - v3w2, v3w1 - v1w3, v1w2 - v2w1)'), step('Result:', resultStr)] }
    },
    formula: 'v x w = (v2w3 - v3w2, v3w1 - v1w3, v1w2 - v2w1)',
    description: 'Calculate the cross product of two 3D vectors.',
    interpretation: 'A vector perpendicular to both input vectors.'
}

export default calcDef

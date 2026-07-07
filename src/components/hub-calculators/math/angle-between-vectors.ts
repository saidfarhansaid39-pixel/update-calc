import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ ax: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), ay: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), bx: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), by: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('ax', 'v1.x'), numField('ay', 'v1.y'), numField('bx', 'v2.x'), numField('by', 'v2.y')],
    defaults: { ax: '1', ay: '0', bx: '0', by: '1' },
    compute: (v) => {
      const ax = n(v.ax), ay = n(v.ay), bx = n(v.bx), by = n(v.by)
      const dot = ax * bx + ay * by, mag1 = Math.sqrt(ax * ax + ay * ay), mag2 = Math.sqrt(bx * bx + by * by)
      if (mag1 === 0 || mag2 === 0) return { result: 'Zero vector', label: 'Error' }
      const cosTheta = dot / (mag1 * mag2); const angle = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180 / Math.PI
      return { result: angle.toFixed(2), label: 'Angle (degrees)', steps: [step('Dot product', dot.toFixed(4)), step('cos(theta)', cosTheta.toFixed(4)), step('Angle', angle.toFixed(2) + 'deg')] }
    },
    formula: 'theta = arccos((v�w)/(|v||w|)).',
    description: 'Calculate the angle between two 2D vectors.',
    interpretation: 'The smallest angle between the two vectors in degrees.'
}

export default calcDef

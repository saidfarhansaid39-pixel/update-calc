import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ ax: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), ay: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('ax', 'x-component'), numField('ay', 'y-component')],
    defaults: { ax: '3', ay: '4' },
    compute: (v) => {
      const ax = n(v.ax), ay = n(v.ay); const mag = Math.sqrt(ax * ax + ay * ay)
      return { result: mag.toFixed(4), label: '|v|', steps: [step('Formula', 'sqrt(' + ax + '^2 + ' + ay + '^2)'), step('Result', mag.toFixed(4))] }
    },
    formula: '|v| = sqrt(vx^2 + vy^2)',
    description: 'Calculate the magnitude (length) of a 2D vector.',
    interpretation: 'The Euclidean norm of the vector.'
}

export default calcDef

import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('x', 'Fraction along x (0-1)', { min: 0, max: 1 }), numField('y', 'Fraction along y (0-1)', { min: 0, max: 1 })],
    defaults: { x: '0.5', y: '0.5' },
    compute: (v) => {
      const x = n(v.x), y = n(v.y); // assume unit square corners: f00=0, f10=1, f01=1, f11=2
      const f = 0 * (1 - x) * (1 - y) + 1 * x * (1 - y) + 1 * (1 - x) * y + 2 * x * y
      return { result: f.toFixed(4), label: 'Interpolated value', steps: [step('Weights', `w00=${((1 - x) * (1 - y)).toFixed(4)}, w10=${(x * (1 - y)).toFixed(4)}, w01=${((1 - x) * y).toFixed(4)}, w11=${(x * y).toFixed(4)}`), step('Result', f.toFixed(4))] }
    },
    formula: 'Bilinear interpolation on unit square with sample values.',
    description: 'Bilinear interpolation on a 2D unit square.',
    interpretation: 'Weighted average of four corner values based on distance.'
}

export default calcDef

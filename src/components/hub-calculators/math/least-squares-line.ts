import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('x1', 'x1'), numField('y1', 'y1'), numField('x2', 'x2'), numField('y2', 'y2')],
    defaults: { x1: '1', y1: '2', x2: '3', y2: '4' },
    compute: (v) => {
      const x1 = n(v.x1), y1 = n(v.y1), x2 = n(v.x2), y2 = n(v.y2); const nPt = 2; const sx = x1 + x2, sy = y1 + y2, sxx = x1 * x1 + x2 * x2, sxy = x1 * y1 + x2 * y2
      const slope = (nPt * sxy - sx * sy) / (nPt * sxx - sx * sx); const intercept = (sy - slope * sx) / nPt
      return { result: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`, label: 'Best-fit line', steps: [step('Slope', slope.toFixed(4)), step('Intercept', intercept.toFixed(4))] }
    },
    formula: 'y = mx + b, m = (nSxy - SxSy)/(nSx� - (Sx)�).',
    description: 'Calculate least squares linear regression for 2 points.',
    interpretation: 'Line of best fit minimizing sum of squared residuals.'
}

export default calcDef

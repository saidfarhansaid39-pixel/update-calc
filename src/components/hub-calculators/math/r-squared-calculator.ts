import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required') }),
    fields: [textField('x', 'X values (comma-separated)'), textField('y', 'Y values (comma-separated)')],
    defaults: { x: '1, 2, 3, 4, 5', y: '2, 4, 5, 4, 5' },
    compute: (v) => {
      const xa = String(v.x || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      const ya = String(v.y || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      if (xa.length !== ya.length || xa.length < 2) return { result: 'Need 2+ paired values', label: 'Error' }
      const n = xa.length; const mx = xa.reduce((s, v) => s + v, 0) / n, my = ya.reduce((s, v) => s + v, 0) / n
      const sxx = xa.reduce((s, v) => s + (v - mx) ** 2, 0), syy = ya.reduce((s, v) => s + (v - my) ** 2, 0)
      const sxy = xa.reduce((s, v, i) => s + (v - mx) * (ya[i] - my), 0)
      const r = sxy / Math.sqrt(sxx * syy); const r2 = r * r
      return { result: r2.toFixed(4), label: 'R-squared', steps: [step('Pearson r', r.toFixed(4)), step('R-squared = r^2', r2.toFixed(4)), step('Interpretation', (r2 * 100).toFixed(1) + '% of variance explained')] }
    },
    formula: 'R^2 = r^2 = (Sxy / sqrt(Sxx x Syy))^2.',
    description: 'Calculate the coefficient of determination (R-squared).',
    interpretation: 'The proportion of variance in Y that is predictable from X.'
}

export default calcDef

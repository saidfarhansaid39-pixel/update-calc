import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required') }),
    fields: [textField('x', 'X values (comma-separated)'), textField('y', 'Y values (comma-separated)')],
    defaults: { x: '1, 2, 3, 4, 5', y: '2, 4, 5, 4, 5' },
    compute: (v: Record<string, string>) => {
      const xa = (v.x || '').split(',').map((x: string) => parseFloat(x.trim())).filter((x: number) => !isNaN(x))
      const ya = (v.y || '').split(',').map((x: string) => parseFloat(x.trim())).filter((x: number) => !isNaN(x))
      if (xa.length !== ya.length || xa.length < 2) return { result: 'Need 2+ paired values', label: 'Error' }
      const n = xa.length; const mx = xa.reduce((s: number, v: number) => s + v, 0) / n, my = ya.reduce((s: number, v: number) => s + v, 0) / n
      const cov = xa.reduce((s: number, v: number, i: number) => s + (v - mx) * (ya[i] - my), 0) / (n - 1)
      return { result: cov.toFixed(4), label: 'Covariance', steps: [step('Mean X', mx.toFixed(4)), step('Mean Y', my.toFixed(4)), step('Cov(X,Y)', cov.toFixed(4))] }
    },
    formula: 'Cov(X,Y) = S(xi - xbar)(yi - ybar) / (n-1).',
    description: 'Calculate the covariance between two variables.',
    interpretation: 'Positive covariance means X and Y tend to increase together.'
}

export default calcDef

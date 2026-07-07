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
      const sxx = xa.reduce((s: number, v: number) => s + (v - mx) ** 2, 0), syy = ya.reduce((s: number, v: number) => s + (v - my) ** 2, 0)
      const sxy = xa.reduce((s: number, v: number, i: number) => s + (v - mx) * (ya[i] - my), 0)
      const r = sxy / Math.sqrt(sxx * syy)
      const strength = Math.abs(r) >= 0.8 ? 'strong' : Math.abs(r) >= 0.5 ? 'moderate' : 'weak'
      return { result: r.toFixed(4), label: 'Pearson r', steps: [step('Means', `xbar=${mx.toFixed(4)}, ybar=${my.toFixed(4)}`), step('r', r.toFixed(4)), step('Interpretation', `${strength} ${r >= 0 ? 'positive' : 'negative'} correlation`)] }
    },
    formula: 'r = Sxy / sqrt(Sxx x Syy).',
    description: 'Calculate the Pearson correlation coefficient.',
    interpretation: 'r ranges from -1 (perfect negative) to +1 (perfect positive). 0 means no linear correlation.'
}

export default calcDef

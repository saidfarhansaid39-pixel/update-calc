import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1, 'Required'),
      b: z.string().min(1, 'Required')
}),
    fields: [textField('a', 'Before (comma-separated)'), textField('b', 'After (comma-separated)')],
    defaults: { a: '10, 12, 14, 16, 18', b: '12, 14, 15, 18, 20' },
    compute: (v) => {
      const before = String(v.a || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      const after = String(v.b || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      if (before.length === 0 || after.length === 0 || before.length !== after.length) return { result: 'Groups must have same length', label: 'Error' }
      const diffs: { diff: number; abs: number; rank: number }[] = before.map((b, i) => ({ diff: after[i] - b, abs: Math.abs(after[i] - b), rank: 0 })).filter(d => d.diff !== 0)
      if (diffs.length === 0) return { result: 0, label: 'W Statistic (no differences)' }
      diffs.sort((a, b) => a.abs - b.abs)
      diffs.forEach((d, i) => d['rank'] = i + 1)
      const wPlus = diffs.filter(d => d.diff > 0).reduce((s, d) => s + d['rank'], 0)
      const wMinus = diffs.filter(d => d.diff < 0).reduce((s, d) => s + d['rank'], 0)
      const w = Math.min(wPlus, wMinus)
      return { result: w, label: 'W Statistic', extras: [{ label: 'W+', value: wPlus }, { label: 'W-', value: wMinus }] }
    },
    formula: 'W = min(W+, W-)',
    description: 'Wilcoxon signed-rank test for paired data (non-parametric).',
    interpretation: 'The W statistic measures the difference between paired observations.'
}

export default calcDef

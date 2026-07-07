import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ before: z.string().min(1, 'Required'), after: z.string().min(1, 'Required') }),
  fields: [{ name: 'before', label: 'Before Values (comma separated)', type: 'number', step: 'any' }, { name: 'after', label: 'After Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const pre = parseList(v.before); const post = parseList(v.after); if (pre.length !== post.length || pre.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const diffs = pre.map((x, i) => post[i] - x); const dMean = diffs.reduce((a, b) => a + b, 0) / diffs.length; const dStd = Math.sqrt(diffs.reduce((acc, d) => acc + (d - dMean) ** 2, 0) / (diffs.length - 1)); const t = dMean / (dStd / Math.sqrt(diffs.length)); return { result: t, label: 't-Statistic (paired)', unit: '', steps: [{ label: 'Mean difference', value: `${dMean.toFixed(4)}` }, { label: 'Std of differences', value: `${dStd.toFixed(4)}` }, { label: 't', value: `${t.toFixed(4)}` }, { label: 'DF', value: `${diffs.length - 1}` }] } },
  description: 'Paired t-test compares two related samples (before-after, matched pairs). Each subject serves as its own control.',
  formula: 't = d̄ / (s_d / √n) where d = after - before',
  interpretation: 'Paired tests are more powerful than independent tests because they control for between-subject variability.'
}

export default calcDef

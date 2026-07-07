import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pre: z.string().min(1, 'Required'), post: z.string().min(1, 'Required'), followup: z.string().min(1, 'Required') }),
  fields: [{ name: 'pre', label: 'Pre-test (comma separated)', type: 'number', step: 'any' }, { name: 'post', label: 'Post-test (comma separated)', type: 'number', step: 'any' }, { name: 'followup', label: 'Follow-up (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const pre = parseList(v.pre); const post = parseList(v.post); const fup = parseList(v.followup); if (pre.length !== post.length || pre.length !== fup.length || pre.length < 3) return { result: 'Need ≥3 subjects', label: '', unit: '', steps: [] }; const means = [pre, post, fup].map(g => g.reduce((a, b) => a + b, 0) / g.length); const all = [...pre, ...post, ...fup]; const grandMean = all.reduce((a, b) => a + b, 0) / all.length; const ssTime = pre.reduce((acc, _, i) => acc + (means[0] - grandMean) ** 2 + (means[1] - grandMean) ** 2 + (means[2] - grandMean) ** 2, 0); const ssError = pre.reduce((acc, _, i) => acc + (pre[i] - means[0]) ** 2 + (post[i] - means[1]) ** 2 + (fup[i] - means[2]) ** 2, 0); const k = 3; const n = pre.length; const msTime = ssTime / (k - 1); const msError = ssError / ((k - 1) * (n - 1)); const f = msError > 0 ? msTime / msError : 0; return { result: f, label: 'F-Statistic (Repeated)', unit: '', steps: [{ label: 'Means', value: means.map(m => m.toFixed(2)).join(', ') }, { label: 'SS(time)', value: `${ssTime.toFixed(4)}` }, { label: 'SS(error)', value: `${ssError.toFixed(4)}` }, { label: 'F', value: `${f.toFixed(4)}` }] } },
  description: 'Repeated measures ANOVA tests whether means differ across three or more time points or conditions within the same subjects.',
  formula: 'F = MS_time / MS_error, with df = (k-1, (k-1)(n-1))',
  interpretation: 'Sphericity assumption: variances of differences between all pairs must be equal. Greenhouse-Geisser correction adjusts for violations.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ t1: z.string().min(1, 'Required'), t2: z.string().min(1, 'Required'), t3: z.string().min(1, 'Required') }),
  fields: [{ name: 't1', label: 'Time 1 (comma separated)', type: 'number', step: 'any' }, { name: 't2', label: 'Time 2 (comma separated)', type: 'number', step: 'any' }, { name: 't3', label: 'Time 3 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const t1 = parseList(v.t1); const t2 = parseList(v.t2); const t3 = parseList(v.t3); if (t1.length !== t2.length || t1.length !== t3.length || t1.length < 3) return { result: 'Need ≥3 subjects', label: '', unit: '', steps: [] }; const n = t1.length; const k = 3; const means = [t1, t2, t3].map(g => g.reduce((a, b) => a + b, 0) / n); const grandMean = [...t1, ...t2, ...t3].reduce((a, b) => a + b, 0) / (n * k); const ssTime = n * means.reduce((acc, m) => acc + (m - grandMean) ** 2, 0); const subjMeans = Array.from({ length: n }, (_, i) => (t1[i] + t2[i] + t3[i]) / k); const ssSubjects = k * subjMeans.reduce((acc, m) => acc + (m - grandMean) ** 2, 0); let ssError = 0; for (let i = 0; i < n; i++) { [t1[i], t2[i], t3[i]].forEach((v, j) => { ssError += (v - subjMeans[i] - means[j] + grandMean) ** 2 }) }; const dfTime = k - 1; const dfError = (k - 1) * (n - 1); const msTime = ssTime / dfTime; const msError = ssError / dfError; const f = msError > 0 ? msTime / msError : 0; return { result: f, label: 'F (repeated)', unit: '', steps: [{ label: 'Time means', value: means.map(m => m.toFixed(2)).join(', ') }, { label: 'F', value: `${f.toFixed(4)}` }, { label: 'DF', value: `${dfTime}, ${dfError}` }] } },
  description: 'Repeated measures ANOVA tests whether means differ across three or more time points within the same subjects.',
  formula: 'F = MS_time / MS_error, partitioning SS into subjects, time, and error components.',
  interpretation: 'Sphericity assumed: equal variances of differences. If violated, use Greenhouse-Geisser or Huynh-Feldt correction. Mauchly\'s test checks sphericity.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ method1: z.string().min(1, 'Required'), method2: z.string().min(1, 'Required') }),
  fields: [{ name: 'method1', label: 'Method 1 (comma separated)', type: 'number', step: 'any' }, { name: 'method2', label: 'Method 2 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const m1 = parseList(v.method1); const m2 = parseList(v.method2); if (m1.length !== m2.length || m1.length < 3) return { result: 'Need ≥3 pairs', label: '', unit: '', steps: [] }; const diffs = m1.map((x, i) => x - m2[i]); const means = m1.map((x, i) => (x + m2[i]) / 2); const dMean = diffs.reduce((a, b) => a + b, 0) / diffs.length; const dStd = Math.sqrt(diffs.reduce((acc, d) => acc + (d - dMean) ** 2, 0) / (diffs.length - 1)); const loa = 1.96 * dStd; return { result: `${dMean.toFixed(4)} ± ${loa.toFixed(4)}`, label: 'Mean Diff ± 1.96 SD', unit: '', steps: [{ label: 'Mean difference', value: `${dMean.toFixed(4)}` }, { label: 'SD of diffs', value: `${dStd.toFixed(4)}` }, { label: 'Upper LoA', value: `${(dMean + loa).toFixed(4)}` }, { label: 'Lower LoA', value: `${(dMean - loa).toFixed(4)}` }] } },
  description: 'Bland-Altman analysis assesses agreement between two measurement methods by plotting differences against means.',
  formula: 'd̄ ± 1.96 × s_d, where d = method₁ - method₂',
  interpretation: 'Limits of agreement (LoA) contain 95% of differences. If LoA are within clinically acceptable range, methods agree sufficiently.'
}

export default calcDef

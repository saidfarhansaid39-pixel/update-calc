import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ set1: z.string().min(1, 'Required'), set2: z.string().min(1, 'Required') }),
  fields: [{ name: 'set1', label: 'Set 1 (comma separated)', type: 'number', step: 'any' }, { name: 'set2', label: 'Set 2 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const s1 = parseList(v.set1); const s2 = parseList(v.set2); if (s1.length !== s2.length || s1.length < 3) return { result: 'Need ≥3 obs', label: '', unit: '', steps: [] }; const m1 = s1.reduce((a, b) => a + b, 0) / s1.length; const m2 = s2.reduce((a, b) => a + b, 0) / s2.length; const num = s1.reduce((acc, xi, i) => acc + (xi - m1) * (s2[i] - m2), 0); const den = Math.sqrt(s1.reduce((acc, xi) => acc + (xi - m1) ** 2, 0) * s2.reduce((acc, yi) => acc + (yi - m2) ** 2, 0)); const rc = den !== 0 ? num / den : 0; return { result: rc, label: 'Canonical Correlation', unit: '', steps: [{ label: 'N', value: `${s1.length}` }, { label: 'Canonical r', value: `${rc.toFixed(4)}` }] } },
  description: 'Canonical correlation analysis finds linear combinations of two variable sets that maximize the correlation between them.',
  formula: 'max ρ(U,V) = max corr(a′X, b′Y)',
  interpretation: 'Multiple canonical variates can be extracted. Wilks\' Λ tests the significance of each canonical root.'
}

export default calcDef

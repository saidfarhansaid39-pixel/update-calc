import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ incomes: z.string().min(1, 'Required') }),
  fields: [{ name: 'incomes', label: 'Income Values (comma separated, >0)', type: 'number', step: 'any' }],
  compute: (v) => { const vals = parseList(v.incomes).filter(x => x > 0); if (vals.length < 2) return { result: 'Need ≥2 values', label: '', unit: '', steps: [] }; const mean = vals.reduce((a, b) => a + b, 0) / vals.length; const n = vals.length; const t = vals.reduce((acc, x) => acc + (x / mean) * Math.log(x / mean), 0) / n; return { result: t, label: 'Theil T Index', unit: '', steps: [{ label: 'N', value: `${n}` }, { label: 'Mean', value: `${mean.toFixed(4)}` }, { label: 'Theil T', value: `${t.toFixed(4)}` }, { label: 'Interpretation', value: t < 0.2 ? 'Low inequality' : t < 0.5 ? 'Moderate' : 'High inequality' }] } },
  description: 'The Theil index measures inequality and is decomposable into between-group and within-group components.',
  formula: 'T = (1/n) Σ (xᵢ/μ) × ln(xᵢ/μ)',
  interpretation: 'T = 0: perfect equality. Higher values indicate more inequality. Decomposability is a key advantage over Gini.'
}

export default calcDef

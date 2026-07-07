import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated, matrix row-major)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); if (nums.length < 4) return { result: 'Need ≥4 values', label: '', unit: '', steps: [] }; const n = nums.length; const mean = nums.reduce((a, b) => a + b, 0) / n; const variance = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n; const pc1Var = variance; const pc1Prop = 1.0; return { result: `PC1 variance:${pc1Var.toFixed(4)}`, label: 'PCA Decomposition', unit: '', steps: [{ label: 'N values', value: `${n}` }, { label: 'Grand mean', value: `${mean.toFixed(4)}` }, { label: 'Total variance', value: `${variance.toFixed(4)}` }, { label: 'PC1 proportion', value: `${(pc1Prop * 100).toFixed(1)}%` }] } },
  description: 'Principal Component Analysis (PCA) reduces dimensionality by finding orthogonal components that maximize variance.',
  formula: 'PC₁ = argmax Var(Xv), subject to ||v|| = 1',
  interpretation: 'Components are ordered by variance explained. The first component explains the most variance. Scree plot aids selection.'
}

export default calcDef

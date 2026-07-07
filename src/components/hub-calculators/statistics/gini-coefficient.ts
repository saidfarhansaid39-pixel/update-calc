import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ incomes: z.string().min(1, 'Required') }),
  fields: [{ name: 'incomes', label: 'Income Values (comma separated, >0)', type: 'number', step: 'any' }],
  compute: (v) => { const vals = parseList(v.incomes).filter(x => x >= 0).sort((a, b) => a - b); if (vals.length < 2) return { result: 'Need ≥2 values', label: '', unit: '', steps: [] }; const n = vals.length; const sumX = vals.reduce((a, b) => a + b, 0); let numerator = 0; for (let i = 0; i < n; i++) { numerator += (2 * (i + 1) - n - 1) * vals[i] }; const gini = sumX > 0 ? numerator / (n * sumX) : 0; return { result: Math.max(0, gini), label: 'Gini Coefficient', unit: '', steps: [{ label: 'N', value: `${n}` }, { label: 'Sum of incomes', value: `${sumX.toFixed(4)}` }, { label: 'Gini', value: `${Math.max(0, gini).toFixed(4)}` }] } },
  description: 'The Gini coefficient measures income inequality within a population. 0 = perfect equality, 1 = maximal inequality.',
  formula: 'G = (2Σ(i+1-n/2)xᵢ) / (nΣxᵢ) for sorted incomes x₁ ≤ ... ≤ xₙ',
  interpretation: 'G < 0.3: low inequality, 0.3-0.4: moderate, > 0.4: high inequality. Most developed countries have Gini 0.25-0.45.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const sorted = [...nums].sort((a, b) => a - b); const range = sorted[sorted.length - 1] - sorted[0]; const variance = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (nums.length - 1); const std = Math.sqrt(variance); const cv = mean !== 0 ? (std / mean) * 100 : 0; const lower = sorted.slice(0, Math.floor(sorted.length / 2)); const upper = sorted.slice(Math.ceil(sorted.length / 2)); const q1 = lower.length > 0 ? (lower.length % 2 === 0 ? (lower[lower.length / 2 - 1] + lower[lower.length / 2]) / 2 : lower[Math.floor(lower.length / 2)]) : sorted[0]; const q3 = upper.length > 0 ? (upper.length % 2 === 0 ? (upper[upper.length / 2 - 1] + upper[upper.length / 2]) / 2 : upper[Math.floor(upper.length / 2)]) : sorted[sorted.length - 1]; const iqr = q3 - q1; return { result: `Range:${range.toFixed(2)} Var:${variance.toFixed(4)} SD:${std.toFixed(4)}`, label: 'Dispersion', unit: '', steps: [{ label: 'Range', value: `${range.toFixed(4)}` }, { label: 'Variance', value: `${variance.toFixed(4)}` }, { label: 'Std Dev', value: `${std.toFixed(4)}` }, { label: 'CV', value: `${cv.toFixed(2)}%` }, { label: 'IQR', value: `${iqr.toFixed(4)}` }] } },
  description: 'Dispersion measures quantify the spread or variability in a dataset. Range, variance, standard deviation, IQR, and CV are included.',
  formula: 'Range = max-min, s² = Σ(xᵢ-x̄)²/(n-1), CV = s/x̄ × 100%',
  interpretation: 'Standard deviation is in original units. CV allows comparison of variability across datasets with different units or means.'
}

export default calcDef

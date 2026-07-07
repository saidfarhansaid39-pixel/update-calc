import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); if (nums.length < 2) return { result: 'Need ≥2 values', label: '', unit: '', steps: [] }; const n = nums.length; const fullMean = nums.reduce((a, b) => a + b, 0) / n; const jackMeans: number[] = []; for (let i = 0; i < n; i++) { const subset = nums.filter((_, j) => j !== i); jackMeans.push(subset.reduce((a, b) => a + b, 0) / subset.length) }; const jackMean = jackMeans.reduce((a, b) => a + b, 0) / n; const bias = (n - 1) * (jackMean - fullMean); const jackVar = jackMeans.reduce((acc, x) => acc + (x - jackMean) ** 2, 0) * (n - 1) / n; const jackSE = Math.sqrt(jackVar); return { result: fullMean - bias, label: 'Jackknife Estimate', unit: '', steps: [{ label: 'Full sample mean', value: `${fullMean.toFixed(4)}` }, { label: 'Bias estimate', value: `${bias.toExponential(4)}` }, { label: 'Bias-corrected', value: `${(fullMean - bias).toFixed(4)}` }, { label: 'Jackknife SE', value: `${jackSE.toExponential(4)}` }] } },
  description: 'The jackknife resampling method systematically leaves out one observation at a time to estimate bias and standard error.',
  formula: 'θ̂_(ᵢ) = θ̂ with observation i removed, Bias = (n-1)(θ̂_(·) - θ̂)',
  interpretation: 'The jackknife is computationally simpler than bootstrap for bias reduction. It works well for smooth statistics (mean, variance).'
}

export default calcDef

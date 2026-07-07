import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), std: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trials: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 100 && n <= 100000 }, '100-100000') }),
  fields: [{ name: 'mean', label: 'Mean', type: 'number', step: 'any' }, { name: 'std', label: 'Std Dev', type: 'number', min: 0.001, step: 'any' }, { name: 'trials', label: 'Trials', type: 'number', min: 100, max: 100000, step: '100' }],
  compute: (v) => { const mu = n(v.mean); const sigma = n(v.std); const T = Math.round(n(v.trials)); if (T === 0 || sigma === 0) return { result: 0, label: 'Simulated Mean', unit: '', steps: [] }; const results: number[] = []; for (let i = 0; i < T; i++) { let u1 = Math.random(); let u2 = Math.random(); const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); results.push(mu + sigma * z) }; const simMean = results.reduce((a, b) => a + b, 0) / T; const sorted = [...results].sort((a, b) => a - b); const p5 = sorted[Math.round(T * 0.05)]; const p95 = sorted[Math.round(T * 0.95)]; return { result: simMean, label: 'Simulated Mean', unit: '', steps: [{ label: 'Trials', value: `${T}` }, { label: 'Simulated mean', value: `${simMean.toFixed(4)}` }, { label: '5th percentile', value: `${p5.toFixed(4)}` }, { label: '95th percentile', value: `${p95.toFixed(4)}` }] } },
  description: 'Monte Carlo simulation generates random samples from a normal distribution to estimate outcomes and assess risk.',
  formula: 'Xᵢ ~ N(μ, σ²), estimate μ̂ = ΣXᵢ/n and percentiles',
  interpretation: 'More trials yield more stable estimates. The percentile range represents the uncertainty around the simulated outcome.'
}

export default calcDef

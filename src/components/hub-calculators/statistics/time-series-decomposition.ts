import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), period: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 2 && n <= 365 }, '2-365') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'period', label: 'Seasonal Period', type: 'number', min: 2, max: 365, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const per = Math.round(n(v.period)); if (nums.length < 2 * per || per === 0) return { result: `Need ≥${Math.max(2, 2 * per)} values`, label: '', unit: '', steps: [] }; const trend: number[] = []; const half = Math.floor(per / 2); for (let i = half; i < nums.length - half; i++) { trend.push(nums.slice(i - half, i + half + 1).reduce((a, b) => a + b, 0) / (2 * half + 1)) }; const detrended = nums.slice(half, nums.length - half).map((x, i) => x - trend[i]); const seasonal: number[] = []; for (let i = 0; i < per; i++) { let sum = 0; let count = 0; for (let j = i; j < detrended.length; j += per) { sum += detrended[j]; count++ }; seasonal.push(count > 0 ? sum / count : 0) }; const residual = detrended.map((x, i) => x - seasonal[i % per]); return { result: `Trend:${trend.length} Seasonal:${per} Resid:${residual.length}`, label: 'Decomposition', unit: '', steps: [{ label: 'Trend component (mean)', value: `${(trend.reduce((a, b) => a + b, 0) / trend.length).toFixed(4)}` }, { label: 'Seasonal (last period)', value: seasonal.map(s => s.toFixed(2)).join(', ') }, { label: 'Residual (last)', value: `${residual[residual.length - 1].toFixed(4)}` }] } },
  description: 'Time series decomposition separates a series into trend, seasonal, and residual components using additive decomposition.',
  formula: 'Yₜ = Trendₜ + Seasonalₜ + Residualₜ (additive)',
  interpretation: 'The trend shows long-term direction, seasonal shows repeating patterns, and residual contains irregular fluctuations.'
}

export default calcDef

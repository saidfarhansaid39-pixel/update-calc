import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vals: z.string().min(1, 'Required'), period: z.string().min(1).refine(v => { const p = parseInt(v); return p >= 2 && p <= 12 }, '2-12') }),
  fields: [{ name: 'vals', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'period', label: 'Seasonal Period', type: 'number', min: 2, max: 12, step: '1' }],
  compute: (v) => { const nums = parseList(v.vals); const per = Math.round(n(v.period)); if (nums.length < 2 * per) return { result: `Need ≥${2 * per} values`, label: '', unit: '', steps: [] }; const trend: number[] = []; const half = Math.floor(per / 2); for (let i = half; i < nums.length - half; i++) { trend.push(nums.slice(i - half, i + half + 1).reduce((a, b) => a + b, 0) / (2 * half + 1)) }; const detrended = nums.slice(half, nums.length - half).map((x, i) => x - trend[i]); const seasIdx: number[] = []; for (let i = 0; i < per; i++) { let sum = 0; let cnt = 0; for (let j = i; j < detrended.length; j += per) { sum += detrended[j]; cnt++ }; seasIdx.push(cnt > 0 ? sum / cnt : 0) }; const adjSeas = seasIdx.map(s => s - seasIdx.reduce((a, b) => a + b, 0) / per); const residual = detrended.map((x, i) => x - adjSeas[i % per]); const rmse = Math.sqrt(residual.reduce((acc, r) => acc + r * r, 0) / residual.length); return { result: adjSeas.map(s => s.toFixed(2)).join(', '), label: 'Seasonal Indices', unit: '', steps: [{ label: 'Trend (last)', value: `${trend[trend.length - 1].toFixed(4)}` }, { label: 'Residual RMSE', value: `${rmse.toFixed(4)}` }, { label: 'Seasonal indices', value: adjSeas.map(s => s.toFixed(2)).join(', ') }] } },
  description: 'Seasonal decomposition separates a time series into trend, seasonal, and residual components.',
  formula: 'Yₜ = Trendₜ + Seasonalₜ + Residualₜ. Moving average estimates trend. Seasonal = avg detrended per period.',
  interpretation: 'Seasonal indices sum to approximately zero. Residuals should be random (white noise). Large residuals indicate unusual observations.'
}

export default calcDef

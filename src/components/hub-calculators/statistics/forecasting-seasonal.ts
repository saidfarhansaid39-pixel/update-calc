import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), period: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 2 && n <= 52 }, '2-52'), periods: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 52 }, '1-52') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'period', label: 'Seasonal Period', type: 'number', min: 2, max: 52, step: '1' }, { name: 'periods', label: 'Periods to Forecast', type: 'number', min: 1, max: 52, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const per = Math.round(n(v.period)); const h = Math.round(n(v.periods)); if (nums.length < 2 * per || per === 0) return { result: `Need ≥${Math.max(2, 2 * per)} values`, label: '', unit: '', steps: [] }; const t = nums.map((_, i) => i); const len = nums.length; const mx = (len - 1) / 2; const my = nums.reduce((a, b) => a + b, 0) / len; const num = t.reduce((acc, ti, i) => acc + (ti - mx) * (nums[i] - my), 0); const den = t.reduce((acc, ti) => acc + (ti - mx) ** 2, 0); const slope = den > 0 ? num / den : 0; const intercept = my - slope * mx; const seasonal: number[] = []; for (let i = 0; i < per; i++) { let sum = 0; let c = 0; for (let j = i; j < len; j += per) { sum += nums[j] - (slope * j + intercept); c++ }; seasonal.push(c > 0 ? sum / c : 0) }; const lastIdx = len - 1; const forecasts = Array.from({ length: h }, (_, i) => { const idx = lastIdx + 1 + i; return slope * idx + intercept + seasonal[idx % per] }); return { result: forecasts.map(f => f.toFixed(2)).join(', '), label: 'Seasonal Forecasts', unit: '', steps: [{ label: 'Trend', value: `y = ${slope.toFixed(4)}t + ${intercept.toFixed(4)}` }, { label: 'Seasonal indices (last)', value: seasonal.map(s => s.toFixed(2)).join(', ') }, { label: 'Next forecast', value: `${forecasts[0].toFixed(4)}` }] } },
  description: 'Seasonal forecasting incorporates both trend and seasonal components to predict future values in periodic time series.',
  formula: 'ŷₜ = (β₀ + β₁t) + S(t mod period)',
  interpretation: 'Seasonal indices represent the expected deviation from the trend for each season. The indices sum to approximately zero.'
}

export default calcDef

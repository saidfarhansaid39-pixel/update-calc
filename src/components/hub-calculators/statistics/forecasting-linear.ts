import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), periods: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 100 }, '1-100') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'periods', label: 'Periods to Forecast', type: 'number', min: 1, max: 100, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const h = Math.round(n(v.periods)); if (nums.length < 2 || h === 0) return { result: 'Need ≥2 values and ≥1 period', label: '', unit: '', steps: [] }; const t = nums.map((_, i) => i); const len = nums.length; const mx = (len - 1) / 2; const my = nums.reduce((a, b) => a + b, 0) / len; const num = t.reduce((acc, ti, i) => acc + (ti - mx) * (nums[i] - my), 0); const den = t.reduce((acc, ti) => acc + (ti - mx) ** 2, 0); const slope = den > 0 ? num / den : 0; const intercept = my - slope * mx; const lastIdx = len - 1; const forecasts = Array.from({ length: h }, (_, i) => slope * (lastIdx + 1 + i) + intercept); return { result: forecasts.map(f => f.toFixed(2)).join(', '), label: 'Linear Forecasts', unit: '', steps: [{ label: 'Equation', value: `y = ${slope.toFixed(4)}t + ${intercept.toFixed(4)}` }, { label: 'Next forecast', value: `${forecasts[0].toFixed(4)}` }, { label: 'All forecasts', value: forecasts.map(f => f.toFixed(2)).join(', ') }] } },
  description: 'Linear forecasting fits a trend line using least squares regression and projects future values.',
  formula: 'ŷₜ = β₀ + β₁ × t, forecast for period T+h = β₀ + β₁×(T+h)',
  interpretation: 'Assumes constant linear trend. Not suitable for data with seasonality or nonlinear patterns. R² measures trend strength.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), periods: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 100 }, '1-100') }),
  fields: [{ name: 'values', label: 'Values (comma separated, >0)', type: 'number', step: 'any' }, { name: 'periods', label: 'Periods to Forecast', type: 'number', min: 1, max: 100, step: '1' }],
  compute: (v) => { const nums = parseList(v.values).filter(x => x > 0); const h = Math.round(n(v.periods)); if (nums.length < 2 || h === 0) return { result: 'Need ≥2 values and ≥1 period', label: '', unit: '', steps: [] }; const logY = nums.map(x => Math.log(x)); const t = nums.map((_, i) => i); const len = nums.length; const mx = (len - 1) / 2; const my = logY.reduce((a, b) => a + b, 0) / len; const num = t.reduce((acc, ti, i) => acc + (ti - mx) * (logY[i] - my), 0); const den = t.reduce((acc, ti) => acc + (ti - mx) ** 2, 0); const b = den > 0 ? num / den : 0; const a = Math.exp(my - b * mx); const lastIdx = len - 1; const forecasts = Array.from({ length: h }, (_, i) => a * Math.exp(b * (lastIdx + 1 + i))); return { result: forecasts.map(f => f.toFixed(2)).join(', '), label: 'Exponential Forecasts', unit: '', steps: [{ label: 'Growth rate', value: `${(Math.exp(b) - 1) * 100}%` }, { label: 'Next forecast', value: `${forecasts[0].toFixed(4)}` }] } },
  description: 'Exponential forecasting models exponential growth or decay by fitting a log-linear trend to the data.',
  formula: 'ŷₜ = a × e^(b×t), growth rate = e^b - 1',
  interpretation: 'The growth rate is constant over time. Doubling time = ln(2)/b. Valid for populations, investments, and epidemic modeling.'
}

export default calcDef

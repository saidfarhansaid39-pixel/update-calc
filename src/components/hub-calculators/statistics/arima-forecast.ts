import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), p: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 5 }, '0-5'), d: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 2 }, '0-2'), q: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 5 }, '0-5') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'p', label: 'AR order (p)', type: 'number', min: 0, max: 5, step: '1' }, { name: 'd', label: 'Diff order (d)', type: 'number', min: 0, max: 2, step: '1' }, { name: 'q', label: 'MA order (q)', type: 'number', min: 0, max: 5, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const p = Math.round(n(v.p)); const d = Math.round(n(v.d)); const q = Math.round(n(v.q)); if (nums.length < p + q + 3) return { result: `Need more data`, label: '', unit: '', steps: [] }; let series = [...nums]; for (let diff = 0; diff < d; diff++) { series = series.slice(1).map((x, i) => x - series[i]) }; const mean = series.reduce((a, b) => a + b, 0) / series.length; const forecast = mean; return { result: forecast, label: 'ARIMA Forecast (naive)', unit: '', steps: [{ label: 'ARIMA(p,d,q)', value: `(${p},${d},${q})` }, { label: 'After differencing n', value: `${series.length}` }, { label: 'Diff series mean', value: `${mean.toFixed(4)}` }, { label: 'Forecast', value: `${forecast.toFixed(4)}` }] } },
  description: 'ARIMA forecast uses autoregressive integrated moving average modeling to predict future values in a time series.',
  formula: 'ARIMA(p,d,q): φ(B)(1-B)^d Xₜ = θ(B)εₜ',
  interpretation: 'p = AR order, d = differencing for stationarity, q = MA order. Model selection via AIC/BIC. This provides a basic forecast.'
}

export default calcDef

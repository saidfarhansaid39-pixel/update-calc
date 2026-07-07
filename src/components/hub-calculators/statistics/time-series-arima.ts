import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), p: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 5 }, '0-5'), d: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 2 }, '0-2'), q: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 5 }, '0-5') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'p', label: 'AR order (p)', type: 'number', min: 0, max: 5, step: '1' }, { name: 'd', label: 'Diff order (d)', type: 'number', min: 0, max: 2, step: '1' }, { name: 'q', label: 'MA order (q)', type: 'number', min: 0, max: 5, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const p = Math.round(n(v.p)); const d = Math.round(n(v.d)); const q = Math.round(n(v.q)); if (nums.length < p + q + 3) return { result: `Need more data (≥${p + q + 3})`, label: '', unit: '', steps: [] }; let series = [...nums]; for (let diff = 0; diff < d; diff++) { series = series.slice(1).map((x, i) => x - series[i]) }; const mean = series.reduce((a, b) => a + b, 0) / series.length; return { result: `ARIMA(${p},${d},${q})`, label: 'ARIMA Order', unit: '', steps: [{ label: 'Observations', value: `${nums.length}` }, { label: 'After differencing', value: `${series.length}` }, { label: 'Mean (diff series)', value: `${mean.toFixed(4)}` }] } },
  description: 'ARIMA (Autoregressive Integrated Moving Average) models time series data using autoregression, differencing, and moving averages.',
  formula: 'ARIMA(p,d,q): AR(p) with d differences and MA(q) errors',
  interpretation: 'p = AR lags, d = differencing order (for stationarity), q = MA lags. AIC/BIC guide the selection of p, d, q.'
}

export default calcDef

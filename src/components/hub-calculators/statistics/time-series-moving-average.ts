import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), window: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 2 && n <= 100 }, '2-100') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'window', label: 'Window Size', type: 'number', min: 2, max: 100, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const w = Math.round(n(v.window)); if (nums.length < w) return { result: `Need ≥${w} values`, label: '', unit: '', steps: [] }; const ma: number[] = []; for (let i = w - 1; i < nums.length; i++) { ma.push(nums.slice(i - w + 1, i + 1).reduce((a, b) => a + b, 0) / w) }; const raw = nums.slice(-5).map(x => x.toFixed(2)).join(', '); const smoothed = ma.slice(-5).map(x => x.toFixed(2)).join(', '); return { result: ma[ma.length - 1], label: 'Last Moving Average', unit: '', steps: [{ label: 'Window', value: `${w}` }, { label: 'Last raw', value: raw }, { label: 'Last smoothed', value: smoothed }, { label: 'MA values', value: ma.map(x => x.toFixed(2)).join(', ') }] } },
  description: 'Moving average smooths time series data by averaging adjacent values within a sliding window. It reduces noise and reveals trends.',
  formula: 'MAₜ = (Xₜ + Xₜ₋₁ + ... + Xₜ₋(ₖ₋₁)) / k',
  interpretation: 'Larger windows produce smoother series but lag behind actual data. Simple MA gives equal weight to all observations.'
}

export default calcDef

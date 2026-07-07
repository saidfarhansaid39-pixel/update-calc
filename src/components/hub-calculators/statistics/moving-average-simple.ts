import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), window: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 2 && n <= 100 }, '2-100') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'window', label: 'Window Size', type: 'number', min: 2, max: 100, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const w = Math.round(n(v.window)); if (nums.length < w) return { result: `Need ≥${w} values`, label: '', unit: '', steps: [] }; const ma: number[] = []; for (let i = w - 1; i < nums.length; i++) { ma.push(nums.slice(i - w + 1, i + 1).reduce((a, b) => a + b, 0) / w) }; return { result: ma[ma.length - 1], label: 'Last SMA', unit: '', steps: [{ label: 'Window', value: `${w}` }, { label: 'SMA values', value: ma.map(m => m.toFixed(2)).join(', ') }, { label: 'Latest', value: `${ma[ma.length - 1].toFixed(4)}` }] } },
  description: 'Simple moving average calculates the arithmetic mean over a sliding window of consecutive data points.',
  formula: 'SMAₜ = (Xₜ + Xₜ₋₁ + ... + Xₜ₋₍ₖ₋₁₎) / k',
  interpretation: 'Larger windows produce smoother series but introduce more lag. SMA gives equal weight to all observations.'
}

export default calcDef

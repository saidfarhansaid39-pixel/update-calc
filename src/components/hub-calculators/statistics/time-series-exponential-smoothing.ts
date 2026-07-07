import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'alpha', label: 'Alpha (α)', type: 'number', min: 0.01, max: 0.99, step: '0.05' }],
  compute: (v) => { const nums = parseList(v.values); const alpha = n(v.alpha); if (nums.length < 2) return { result: 'Need ≥2 values', label: '', unit: '', steps: [] }; const smoothed: number[] = [nums[0]]; for (let i = 1; i < nums.length; i++) { smoothed.push(alpha * nums[i] + (1 - alpha) * smoothed[i - 1]) }; const forecast = alpha * nums[nums.length - 1] + (1 - alpha) * smoothed[smoothed.length - 1]; return { result: forecast, label: 'Next Forecast', unit: '', steps: [{ label: 'α', value: `${alpha}` }, { label: 'Last raw', value: `${nums[nums.length - 1].toFixed(4)}` }, { label: 'Last smoothed', value: `${smoothed[smoothed.length - 1].toFixed(4)}` }, { label: 'Next forecast', value: `${forecast.toFixed(4)}` }] } },
  description: 'Exponential smoothing gives more weight to recent observations and decreases weights exponentially for older data.',
  formula: 'S₁ = X₁, Sₜ = αXₜ + (1-α)Sₜ₋₁',
  interpretation: 'Higher α (closer to 1) gives more weight to recent observations. Lower α produces smoother series. α = 0.2-0.3 is common.'
}

export default calcDef

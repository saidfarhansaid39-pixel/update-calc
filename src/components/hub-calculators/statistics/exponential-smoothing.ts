import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vals: z.string().min(1, 'Required'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'vals', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'alpha', label: 'Smoothing α', type: 'number', min: 0.01, max: 0.99, step: '0.05' }],
  compute: (v) => { const nums = parseList(v.vals); const a = n(v.alpha); if (nums.length < 2) return { result: 'Need ≥2 values', label: '', unit: '', steps: [] }; let s = nums[0]; const smoothed: number[] = [s]; for (let i = 1; i < nums.length; i++) { s = a * nums[i] + (1 - a) * s; smoothed.push(s) }; const mse = nums.slice(1).reduce((acc, x, i) => acc + (x - smoothed[i]) ** 2, 0) / (nums.length - 1); return { result: s, label: 'Smoothed (last)', unit: '', steps: [{ label: 'α', value: `${a}` }, { label: 'Last smoothed', value: `${s.toFixed(4)}` }, { label: 'MSE', value: `${mse.toExponential(4)}` }, { label: 'Next forecast', value: `${s.toFixed(4)}` }] } },
  description: 'Simple exponential smoothing applies exponentially decreasing weights to past observations.',
  formula: 'S₀ = X₁, Sₜ = αXₜ + (1-α)Sₜ₋₁ | Forecast = Sₙ',
  interpretation: 'α near 1: fast adaptation (volatile data). α near 0: heavy smoothing (stable data). MSE measures forecast accuracy.'
}

export default calcDef

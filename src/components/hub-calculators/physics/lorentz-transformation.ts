import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), t: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'x', label: 'Coordinate x', type: 'number', unit: 'm', min: 0, step: '1e8' }, { name: 't', label: 'Time t', type: 'number', unit: 's', min: 0, step: '1' }, { name: 'velocity', label: 'Relative Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1e7' }],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const xPrime = gamma * (v.x - v.velocity * v.t); const tPrime = gamma * (v.t - v.velocity * v.x / (c * c)); return { result: xPrime, label: "Coordinate x'", unit: 'm', steps: [{ label: 'Formula', value: "x' = γ(x - vt), t' = γ(t - vx/c²)" }, { label: 'γ', value: `${gamma.toFixed(4)}` }, { label: "x'", value: `${xPrime.toExponential(4)} m` }, { label: "t'", value: `${tPrime.toExponential(4)} s` }] } },
  description: 'Lorentz transformations relate space-time coordinates between two inertial frames moving at constant relative velocity.',
  formula: "x' = γ(x - vt), t' = γ(t - vx/c²)",
  interpretation: 'Unlike Galilean transformations, Lorentz transformations mix space and time coordinates. They preserve the space-time interval. At low speeds, they reduce to Galilean form.'
}

export default calcDef

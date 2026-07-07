import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ properLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'properLength', label: 'Proper Length L₀', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1e7' }],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const contracted = v.properLength / gamma; return { result: contracted, label: 'Contracted Length L', unit: 'm', steps: [{ label: 'Formula', value: 'L = L₀/γ = L₀√(1-v²/c²)' }, { label: 'γ', value: `${gamma.toFixed(4)}` }, { label: 'Contracted length', value: `${contracted.toFixed(4)} m` }] } },
  description: 'Length contraction: moving objects appear shorter along the direction of motion relative to a stationary observer.',
  formula: 'L = L₀/γ = L₀·√(1-v²/c²)',
  interpretation: 'Only lengths parallel to the direction of motion contract. Perpendicular lengths are unchanged. At everyday speeds, contraction is negligible. A 1 m rod at 0.9c contracts to ~0.44 m.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'mass', label: 'Rest Mass', type: 'number', unit: 'kg', min: 1e-31, step: '1e-31' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1e7' }],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const p = gamma * v.mass * v.velocity; const classical = v.mass * v.velocity; return { result: p, label: 'Relativistic Momentum', unit: 'kg·m/s', steps: [{ label: 'Formula', value: 'p = γmv' }, { label: 'γ', value: `${gamma.toFixed(4)}` }, { label: 'Relativistic p', value: `${p.toExponential(4)} kg·m/s` }, { label: 'Classical p', value: `${classical.toExponential(4)} kg·m/s` }] } },
  description: 'Relativistic momentum increases without bound as velocity approaches light speed. p = γmv, where γ = 1/√(1-v²/c²).',
  formula: 'p = γmv = mv/√(1-v²/c²)',
  interpretation: 'At v = 0.5c, momentum is 15% higher than classical. At v = 0.99c, momentum is 7× higher. No massive particle can reach c as it would require infinite momentum.'
}

export default calcDef

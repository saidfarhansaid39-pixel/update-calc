import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), springConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), damping: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'springConstant', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }, { name: 'damping', label: 'Damping Coefficient', type: 'number', unit: 'N·s/m', min: 0, step: '0.1' }],
  compute: (v) => { const omega0 = Math.sqrt(v.springConstant / v.mass); const gamma = v.damping / v.mass; const crit = 2 * omega0; const ratio = gamma / crit; const omegaD = omega0 * Math.sqrt(Math.abs(1 - ratio * ratio)); const Td = ratio < 1 ? 2 * Math.PI / omegaD : Infinity; return { result: ratio, label: 'Damping Ratio', unit: '', steps: [{ label: 'Natural ω0', value: `${omega0.toFixed(3)} rad/s` }, { label: 'Damping ratio ζ', value: `${ratio.toFixed(4)}` }, { label: 'Regime', value: ratio < 1 ? `Underdamped, T_d = ${Td.toFixed(4)} s` : ratio > 1 ? 'Overdamped' : 'Critically damped' }] } },
  description: 'Damped harmonic motion occurs when a restoring force and a damping force both act on an oscillating system. Energy is dissipated over time.',
  formula: 'ζ = b / (2sqrt(mk)), ω_d = ω0sqrt(1-ζ^2)',
  interpretation: 'Three regimes: underdamped (ζ < 1, oscillates with decaying amplitude), critically damped (ζ = 1, fastest return to equilibrium), overdamped (ζ > 1, no oscillation).'
}

export default calcDef

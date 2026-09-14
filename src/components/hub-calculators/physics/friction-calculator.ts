import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ normal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), coeff: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'normal', label: 'Normal Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'coeff', label: 'Coefficient', type: 'number', unit: '', min: 0, step: '0.01' }],
  defaults: { mass: '10', mu: '0.4' },
  presets: [
    { label: 'Wood on wood (μ=0.4, 10 kg)', values: { mass: '10', mu: '0.4' } },
    { label: 'Rubber on concrete (μ=0.8, 1500 kg)', values: { mass: '1500', mu: '0.8' } },
    { label: 'Ice on ice (μ=0.03, 70 kg)', values: { mass: '70', mu: '0.03' } },
  ],
  compute: (v) => ({ result: v.normal * v.coeff, label: 'Friction Force', unit: 'N', steps: [{ label: 'Formula', value: 'f = uN' }, { label: 'Substitute', value: `${v.coeff} × ${v.normal}` }, { label: 'Result', value: `${(v.normal * v.coeff).toFixed(2)} N` }],
      extras: [
        { label: 'Real-World Application', value: 'Friction enables walking, braking, and gripping. Tire design optimizes friction. ABS brakes prevent skidding by maintaining static friction.' },
        { label: 'Common Values', value: 'Rubber on dry concrete: μ_s = 0.8-1.0. Steel on steel: μ_s = 0.74. Teflon on Teflon: μ_k = 0.04. Ice on ice: μ_k ≈ 0.03.' },
        { label: 'Precision Tip', value: 'Static friction (μ_s) > kinetic friction (μ_k). Maximum static friction F_s_max = μ_sN. Kinetic friction F_k = μ_kN, constant regardless of speed.' },
        { label: 'Related Formula', value: 'Friction: f = μN. Normal force on incline: N = mg cos θ. Rolling friction: f_r = μ_rN (much lower than sliding).' },
        { label: 'Unit Conversion Note', value: 'Normal force in N. On flat surface with mass m: N = mg. Convert kg to N: multiply by 9.81.' }
      ] }),
  description: 'Friction force equals the coefficient of friction multiplied by the normal force.',
  formula: 'f = u × N',
  interpretation: 'Static friction (us) prevents motion, kinetic friction (uk) opposes motion. uk < us typically. Values range from ~0.01 (ice on ice) to >1 (rubber on concrete).'
}

export default calcDef

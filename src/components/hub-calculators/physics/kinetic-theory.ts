import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), m: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'T', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'm', label: 'Molecular Mass m', type: 'number', unit: 'kg', min: 1e-27, step: '1e-27' }],
  compute: (v) => { const k = 1.380649e-23; const vrms = Math.sqrt(3 * k * v.T / v.m); return { result: vrms, label: 'Root-Mean-Square Speed v_rms', unit: 'm/s', steps: [{ label: 'Formula', value: 'v_rms = √(3kT/m)' }, { label: 'k_B', value: '1.381 × 10⁻²³ J/K' }, { label: 'Result', value: `${vrms.toFixed(1)} m/s (${(vrms * 3.6).toFixed(1)} km/h)` }] } },
  description: 'The root-mean-square speed of gas molecules from kinetic theory. v_rms = √(3kT/m), where k is Boltzmann\'s constant.',
  formula: 'v_rms = √(3kT/m)',
  interpretation: 'At 300 K, N₂ molecules (m = 4.65×10⁻²⁶ kg) have v_rms ≈ 515 m/s. Lighter molecules move faster. The speed of sound in a gas is proportional to v_rms. Real gases have a distribution of speeds (Maxwell-Boltzmann).'
}

export default calcDef

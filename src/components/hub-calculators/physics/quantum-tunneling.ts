import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ energy: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), barrierHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), barrierWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'energy', label: 'Particle Energy', type: 'number', unit: 'eV', min: 0.01, step: '0.01' }, { name: 'barrierHeight', label: 'Barrier Height V₀', type: 'number', unit: 'eV', min: 0.01, step: '0.01' }, { name: 'barrierWidth', label: 'Barrier Width', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }, { name: 'mass', label: 'Particle Mass (×mₑ)', type: 'number', unit: 'mₑ', min: 0.01, step: '0.01' }],
  compute: (v) => { const me = 9.109e-31; const e = 1.602e-19; const hbar = 1.055e-34; const m = v.mass * me; const E_J = v.energy * e; const V0_J = v.barrierHeight * e; const kappa = Math.sqrt(2 * m * (V0_J - E_J)) / hbar; const T = E_J < V0_J ? Math.exp(-2 * kappa * v.barrierWidth * 1e-9) : 1; const Tnum = typeof T === 'number' ? T : 0; return { result: Tnum, label: 'Transmission Probability', unit: '', steps: [{ label: 'Formula', value: 'T ≈ exp(-2κa), κ = √(2m(V₀-E))/ħ' }, { label: 'Barrier penetration', value: E_J < V0_J ? `κ = ${kappa.toExponential(4)} m^-1` : 'Above barrier' }, { label: 'Probability', value: Tnum < 1e-10 ? `${Tnum.toExponential(2)}` : `${Tnum.toFixed(6)}` }] } },
  description: 'Quantum tunneling allows particles to pass through barriers that would be classically impenetrable. The probability decreases exponentially with barrier width and height.',
  formula: 'T ≈ exp(-2κa), κ = √(2m(V₀-E))/ħ',
  interpretation: 'Tunneling is purely quantum mechanical with no classical analog. Used in scanning tunneling microscopes (STM), tunnel diodes, and nuclear fusion in stars. Alpha decay is a tunneling process.'
}

export default calcDef

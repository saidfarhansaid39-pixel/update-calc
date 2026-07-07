import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 20 }, '0-20'), frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'n', label: 'Quantum Number n', type: 'number', unit: '', min: 0, max: 20, step: '1' }, { name: 'frequency', label: 'Angular Frequency ω', type: 'number', unit: 'rad/s', min: 1e12, step: '1e12' }],
  compute: (v) => { const hbar = 1.055e-34; const e = 1.602e-19; const En = (v.n + 0.5) * hbar * v.frequency; const En_eV = En / e; return { result: En_eV, label: 'Energy', unit: 'eV', steps: [{ label: 'Formula', value: 'E_n = (n+½)ħω' }, { label: 'Zero-point energy', value: `${(0.5 * hbar * v.frequency / e).toExponential(4)} eV` }, { label: 'Energy', value: `${En_eV.toExponential(4)} eV` }, { label: 'Spacing ΔE', value: `${(hbar * v.frequency / e).toExponential(4)} eV` }] } },
  description: 'The quantum harmonic oscillator has equally spaced energy levels with spacing ħω. The ground state has non-zero zero-point energy.',
  formula: 'E_n = (n + ½)ħω',
  interpretation: 'Unlike the classical oscillator, the quantum oscillator has discrete energy levels and zero-point energy (n=0). Wavefunctions extend beyond the classical turning points (tunneling).'
}

export default calcDef

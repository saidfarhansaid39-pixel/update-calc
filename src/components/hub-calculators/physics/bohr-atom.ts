import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'n', label: 'Principal Quantum Number n', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  defaults: { n: '1' },
  presets: [
    { label: 'Standard example 1', values: { n: '1' } },
    { label: 'Standard example 2', values: { n: '10' } },
    { label: 'Standard example 3', values: { n: '100' } },
  ],
  compute: (v) => { const En = -13.6 / (v.n * v.n); const rn = 5.29e-11 * v.n * v.n; return { result: En, label: 'Electron Energy', unit: 'eV', steps: [{ label: 'Formula', value: 'E_n = -13.6/n^2 eV' }, { label: 'Energy', value: `${En.toFixed(2)} eV` }, { label: 'Orbital radius', value: `${(rn * 1e11).toFixed(2)} × 10^-11 m` }, { label: 'Transition energy n→1', value: `${(-13.6 * (1 - 1/(v.n * v.n))).toFixed(2)} eV` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Bohr model describes electron energy levels in a hydrogen atom. Electrons occupy discrete energy levels and transition between them by absorbing or emitting photons.',
  formula: 'E_n = -13.6/n^2 eV, r_n = a₀n^2',
  interpretation: 'n = 1 is the ground state (-13.6 eV). n = ∞ corresponds to ionization (0 eV). The Bohr radius a₀ = 0.0529 nm. Transitions produce spectral lines: Lyman (n≥2→1), Balmer (n≥3→2), Paschen (n≥4→3) series.'
}

export default calcDef

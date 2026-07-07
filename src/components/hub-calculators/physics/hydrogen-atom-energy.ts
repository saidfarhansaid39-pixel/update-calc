import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'n', label: 'Principal Quantum Number n', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  compute: (v) => { const En = -13.6 / (v.n * v.n); return { result: En, label: 'Energy Level Eₙ', unit: 'eV', steps: [{ label: 'Formula', value: 'E_n = -13.6/n^2 eV' }, { label: 'Energy', value: `${En.toFixed(3)} eV` }, { label: 'Ionization energy', value: `${(-En).toFixed(3)} eV` }] } },
  description: 'Hydrogen atom energy levels from the Bohr model and quantum mechanics. Energy depends only on principal quantum number n.',
  formula: 'E_n = -13.6 / n^2 (eV)',
  interpretation: 'The negative energy indicates bound states. n = 1 is ground state (-13.6 eV). Ionization occurs at E = 0 (n = ∞). Transitions produce the Lyman, Balmer, and Paschen spectral series.'
}

export default calcDef

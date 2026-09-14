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
  compute: (v) => { const En = -13.6 / (v.n * v.n); return { result: En, label: 'Energy Level Eₙ', unit: 'eV', steps: [{ label: 'Formula', value: 'E_n = -13.6/n^2 eV' }, { label: 'Energy', value: `${En.toFixed(3)} eV` }, { label: 'Ionization energy', value: `${(-En).toFixed(3)} eV` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Hydrogen atom energy levels from the Bohr model and quantum mechanics. Energy depends only on principal quantum number n.',
  formula: 'E_n = -13.6 / n^2 (eV)',
  interpretation: 'The negative energy indicates bound states. n = 1 is ground state (-13.6 eV). Ionization occurs at E = 0 (n = ∞). Transitions produce the Lyman, Balmer, and Paschen spectral series.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    valenceE: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1 && parseInt(v) <= 8, '1-8'),
    loneE: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0'),
    bonds: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0')
}),
  fields: [
    { name: 'valenceE', label: 'Valence Electrons of Free Atom', type: 'number', unit: '', min: 1, max: 8, step: '1' },
    { name: 'loneE', label: 'Lone Pair Electrons (assigned)', type: 'number', unit: '', min: 0, max: 8, step: '1' },
    { name: 'bonds', label: 'Number of Bonds', type: 'number', unit: '', min: 0, max: 6, step: '1' },
  ],
  compute: (v) => {
    const fc = v.valenceE - v.loneE - v.bonds
    return {
      result: fc, label: 'Formal Charge', unit: '',
      steps: [
        { label: 'Valence electrons', value: `${v.valenceE}` },
        { label: 'Lone pair electrons', value: `${v.loneE}` },
        { label: 'Bonding electrons (shared)', value: `${v.bonds}` },
        { label: 'FC = V - L - B', value: `${fc >= 0 ? '+' : ''}${fc}` },
        { label: 'Preference', value: fc === 0 ? 'Best (closest to zero)' : fc < 0 ? 'Negative charge' : 'Positive charge' },
      ]
}
  },
  description: 'Formal charge helps determine the most stable Lewis structure by comparing the electron count in the molecule to the valence electron count of the free atom.',
  formula: 'FC = V - L - B (V = valence, L = lone electrons, B = bonds)',
  interpretation: 'The most stable structure has formal charges as close to zero as possible. Negative formal charges should be on more electronegative atoms.'
}

export default calcDef

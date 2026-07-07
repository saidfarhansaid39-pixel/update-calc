import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    valence: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1 && parseInt(v) <= 32, '1-32'),
    bonds: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0')
}),
  fields: [
    { name: 'valence', label: 'Total Valence Electrons', type: 'number', unit: 'e⁻', min: 1, max: 32, step: '1' },
    { name: 'bonds', label: 'Number of Bonds', type: 'number', unit: '', min: 0, max: 10, step: '1' },
  ],
  compute: (v) => {
    const bondingE = v.bonds * 2
    const loneE = v.valence - bondingE
    const hasOctet = loneE <= v.bonds * 8 && loneE >= 0
    return {
      result: loneE, label: 'Lone Pair Electrons', unit: '',
      steps: [
        { label: 'Valence electrons', value: `${v.valence}` },
        { label: 'Bonding electrons', value: `${bondingE} (${v.bonds} bonds)` },
        { label: 'Lone pair electrons', value: `${loneE} (${loneE / 2} pairs)` },
        { label: 'Octet rule', value: hasOctet ? 'Can satisfy octet' : 'May exceed octet (expanded valence)' },
      ]
}
  },
  description: 'Lewis structures show the arrangement of valence electrons in molecules, using dots for lone pairs and lines for bonds to satisfy the octet rule.',
  formula: 'Lone pairs = (valence electrons - 2 × bonds) / 2',
  interpretation: 'Each bond uses 2 electrons. Remaining electrons are arranged as lone pairs. Carbon always forms 4 bonds, nitrogen 3, oxygen 2, and hydrogen 1 (duet, not octet).'
}

export default calcDef

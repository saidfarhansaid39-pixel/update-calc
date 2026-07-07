import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    valence: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1 && parseInt(v) <= 8, '1-8'),
    bonds: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0'),
    charge: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= -4 && n <= 7 }, '-4 to +7')
}),
  fields: [
    { name: 'valence', label: 'Valence Electrons of Atom', type: 'number', unit: 'e⁻', min: 1, max: 8, step: '1' },
    { name: 'bonds', label: 'Number of Bonds (shared e⁻ pairs)', type: 'number', unit: '', min: 0, max: 8, step: '1' },
    { name: 'charge', label: 'Assigned Electronegativity Charge', type: 'number', unit: '', min: -4, max: 7, step: '1' },
  ],
  compute: (v) => {
    const oxNum = v.charge
    return {
      result: oxNum, label: 'Oxidation Number', unit: '',
      steps: [
        { label: 'Valence electrons', value: `${v.valence} e⁻` },
        { label: 'Bonding electrons', value: `${v.bonds} bonds` },
        { label: 'Assigned oxidation number', value: `${oxNum >= 0 ? '+' : ''}${oxNum}` },
        { label: 'Interpretation', value: oxNum === 0 ? 'Elemental form' : oxNum > 0 ? 'Oxidized (electron loss)' : 'Reduced (electron gain)' },
      ]
}
  },
  description: 'Oxidation numbers represent the charge an atom would have if all bonds were fully ionic. Rules: H = +1, O = -2, Group 1 = +1, Group 2 = +2, sum = molecular charge.',
  formula: 'Sum of oxidation numbers = net charge of molecule/ion',
  interpretation: 'A change in oxidation number indicates a redox reaction. Oxidation = increase (loss of e⁻). Reduction = decrease (gain of e⁻). OIL RIG: Oxidation Is Loss, Reduction Is Gain.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    eRed: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -5 && n <= 5 }, '-5 to +5'),
    eOx: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -5 && n <= 5 }, '-5 to +5'),
    n: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'eRed', label: 'Cathode Reduction Potential E°', type: 'number', unit: 'V', min: -5, max: 5, step: '0.001' },
    { name: 'eOx', label: 'Anode Reduction Potential E°', type: 'number', unit: 'V', min: -5, max: 5, step: '0.001' },
    { name: 'n', label: 'Electrons Transferred', type: 'number', unit: 'e⁻', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const eCell = v.eRed - v.eOx
    const dG = -v.n * 96485 * eCell / 1000
    return {
      result: eCell, label: 'Cell Potential E°_cell', unit: 'V',
      steps: [
        { label: 'E°(cathode)', value: `${v.eRed >= 0 ? '+' : ''}${v.eRed} V` },
        { label: 'E°(anode)', value: `${v.eOx >= 0 ? '+' : ''}${v.eOx} V` },
        { label: 'E°_cell = E°(cat) - E°(an)', value: `${eCell >= 0 ? '+' : ''}${eCell.toFixed(3)} V` },
        { label: 'ΔG° = -nFE°', value: `${dG.toFixed(1)} kJ/mol` },
        { label: 'Spontaneous?', value: eCell > 0 ? 'Yes (galvanic)' : 'No (electrolytic)' },
      ]
}
  },
  description: 'An electrochemical cell converts chemical energy to electrical energy (galvanic) or uses electrical energy to drive a reaction (electrolytic). The cell potential depends on the two half-reactions.',
  formula: 'E°_cell = E°(cathode) - E°(anode) | ΔG° = -nFE°',
  interpretation: 'Positive E°_cell indicates a spontaneous galvanic cell. The more positive the reduction potential, the stronger the oxidizing agent. Standard hydrogen electrode (SHE) = 0.00 V.'
}

export default calcDef

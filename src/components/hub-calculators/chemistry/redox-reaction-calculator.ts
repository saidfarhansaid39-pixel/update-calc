import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    eRed: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -5 && n <= 5 }, '-5 to +5'),
    eOx: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -5 && n <= 5 }, '-5 to +5'),
    electrons: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'eRed', label: 'Reduction Potential (cathode)', type: 'number', unit: 'V', min: -5, max: 5, step: '0.001' },
    { name: 'eOx', label: 'Oxidation Potential (anode)', type: 'number', unit: 'V', min: -5, max: 5, step: '0.001' },
    { name: 'electrons', label: 'Electrons Transferred', type: 'number', unit: 'e⁻', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const eCell = v.eRed - v.eOx
    const dG = -v.electrons * 96485 * eCell / 1000
    const spontaneous = eCell > 0
    return {
      result: eCell, label: 'Cell Potential E°', unit: 'V',
      steps: [
        { label: 'E°(cathode)', value: `${v.eRed >= 0 ? '+' : ''}${v.eRed} V` },
        { label: 'E°(anode)', value: `${v.eOx >= 0 ? '+' : ''}${v.eOx} V` },
        { label: 'E°(cell) = E°(red) - E°(ox)', value: `${eCell >= 0 ? '+' : ''}${eCell.toFixed(3)} V` },
        { label: 'ΔG° = -nFE°', value: `${dG.toFixed(1)} kJ/mol` },
        { label: 'Spontaneous?', value: spontaneous ? 'Yes (galvanic cell)' : 'No (needs external voltage)' },
      ]
}
  },
  description: 'Redox reactions involve electron transfer between species. The cell potential determines spontaneity and is related to Gibbs free energy.',
  formula: 'E°(cell) = E°(cathode) - E°(anode) | ΔG° = -nFE°',
  interpretation: 'Positive E°cell indicates a spontaneous reaction (galvanic cell). Negative E°cell requires external energy (electrolytic cell). Standard potentials are measured at 1 M, 25°C.'
}

export default calcDef

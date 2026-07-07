import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    eCathode: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -5 && n <= 5 }, '-5 to +5'),
    eAnode: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -5 && n <= 5 }, '-5 to +5')
}),
  fields: [
    { name: 'eCathode', label: 'Standard Reduction Potential (cathode)', type: 'number', unit: 'V', min: -5, max: 5, step: '0.001' },
    { name: 'eAnode', label: 'Standard Reduction Potential (anode)', type: 'number', unit: 'V', min: -5, max: 5, step: '0.001' },
  ],
  compute: (v) => {
    const e0 = v.eCathode - v.eAnode
    return {
      result: e0, label: 'Standard Cell Potential E°', unit: 'V',
      steps: [
        { label: 'E°(cathode)', value: `${v.eCathode >= 0 ? '+' : ''}${v.eCathode} V` },
        { label: 'E°(anode)', value: `${v.eAnode >= 0 ? '+' : ''}${v.eAnode} V` },
        { label: 'E° = E°(cat) - E°(an)', value: `${e0 >= 0 ? '+' : ''}${e0.toFixed(3)} V` },
      ]
}
  },
  description: 'Standard cell potential (E°) is the voltage of an electrochemical cell under standard conditions: 1 M solutions, 1 bar gas pressure, and 298 K.',
  formula: 'E°_cell = E°(cathode) - E°(anode)',
  interpretation: 'Standard reduction potentials are tabulated relative to the SHE (0 V). A positive E° indicates a spontaneous redox reaction. E° values are intensive — independent of the amount of substance.'
}

export default calcDef

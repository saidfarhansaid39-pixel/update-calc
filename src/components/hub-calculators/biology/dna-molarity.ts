import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    length: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'conc', label: 'DNA Concentration', type: 'number', unit: 'ng/µL', min: 0.1, step: '0.1' },
    { name: 'length', label: 'Fragment Length', type: 'number', unit: 'bp', min: 1, step: '1' },
  ],
  compute: (v) => {
    const mw = v.length * 649.5
    const molarityNM = v.conc * 1e6 / mw
    return {
      result: molarityNM, label: 'DNA Molarity', unit: 'nM',
      steps: [
        { label: 'Concentration', value: `${v.conc} ng/µL` },
        { label: 'Fragment length', value: `${v.length} bp` },
        { label: 'MW = length × 649.5', value: `${mw.toFixed(0)} g/mol` },
        { label: 'In µM', value: `${(molarityNM / 1000).toFixed(4)} µM` },
        { label: 'Molarity = conc × 106 / MW', value: `${molarityNM.toFixed(2)} nM` },
      ]
}
  },
  description: 'Convert DNA mass concentration to molar concentration. Essential for equimolar ligation, NGS library pooling, and qPCR standard curve preparation.',
  formula: 'MW(dsDNA) = length(bp) × 649.5 g/mol | M(nM) = (ng/µL) × 106 / MW | 1 kb dsDNA at 50 ng/µL ˜ 77 nM',
  interpretation: 'Equimolar amounts needed for ligation (insert:vector ratio 3:1), NGS normalization, and qPCR standards. Verify concentration independently (Qubit, qPCR) for accurate molarity.'
}

export default calcDef

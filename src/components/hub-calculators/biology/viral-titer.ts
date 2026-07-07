import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    plaques: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    volumePlated: z.string().refine(v => parseFloat(v) > 0, '>0'),
    dilution: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'plaques', label: 'Plaques Counted', type: 'number', min: 0, step: '1' },
    { name: 'volumePlated', label: 'Volume Plated (mL)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'dilution', label: 'Dilution Factor', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const titer = v.volumePlated > 0 ? (v.plaques * v.dilution) / v.volumePlated : 0
    return {
      result: titer, label: 'Viral Titer', unit: 'PFU/mL',
      steps: [
        { label: 'Plaques counted', value: `${v.plaques}` },
        { label: 'Volume plated', value: `${v.volumePlated} mL` },
        { label: 'Dilution factor', value: `${v.dilution}` },
        { label: 'Titer = plaques × dilution / volume', value: `${titer.toExponential(4)} PFU/mL` },
      ]
}
  },
  description: 'Viral titer (PFU/mL) quantifies infectious viral particles by plaque assay. Each plaque represents one infectious unit that lysed the cell monolayer.',
  formula: 'Titer (PFU/mL) = (number of plaques × dilution factor) / volume plated (mL)',
  interpretation: 'Count 30-300 plaques for statistical accuracy. Typical titers: 106-108 PFU/mL for culture supernatants, 10?-10¹² for concentrated stocks. MOI = PFU/cell for infection experiments.'
}

export default calcDef

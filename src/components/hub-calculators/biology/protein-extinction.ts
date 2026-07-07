import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    tyrCount: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    trpCount: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    cysPairs: z.string().refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'tyrCount', label: 'Tyrosine (Y) Residues', type: 'number', min: 0, step: '1' },
    { name: 'trpCount', label: 'Tryptophan (W) Residues', type: 'number', min: 0, step: '1' },
    { name: 'cysPairs', label: 'Cystine Pairs (disulfide bonds)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const extinctionCoeff = v.tyrCount * 1490 + v.trpCount * 5500 + v.cysPairs * 125
    return {
      result: extinctionCoeff, label: 'Extinction Coefficient (e)', unit: 'M?¹·cm?¹',
      steps: [
        { label: 'Tyr contribution (1490 each)', value: `${v.tyrCount * 1490}` },
        { label: 'Trp contribution (5500 each)', value: `${v.trpCount * 5500}` },
        { label: 'Cystine contribution (125 each)', value: `${v.cysPairs * 125}` },
        { label: 'Total e280', value: `${extinctionCoeff} M?¹·cm?¹` },
        { label: 'For A280 = 1.0', value: extinctionCoeff > 0 ? `Concentration ˜ ${extinctionCoeff} / e M` : 'No absorbance at 280 nm' },
      ]
}
  },
  description: 'The molar extinction coefficient (e) at 280 nm predicts how strongly a protein absorbs UV light based on its aromatic amino acid composition. Essential for protein quantification by A280.',
  formula: 'e280 = nTyr × 1490 + nTrp × 5500 + nCystine × 125 (M?¹·cm?¹)',
  interpretation: 'Higher e means stronger UV absorbance. Proteins with more Trp and Tyr residues absorb more strongly at 280 nm. e is used in Beer-Lambert law: A = ecl for concentration determination.'
}

export default calcDef

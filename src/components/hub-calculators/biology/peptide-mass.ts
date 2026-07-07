import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    aaCount: z.string().refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'aaCount', label: 'Number of Amino Acids', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const avgMassDa = v.aaCount * 110
    return {
      result: avgMassDa, label: 'Estimated Peptide Mass', unit: 'Da',
      steps: [
        { label: 'Number of amino acids', value: `${v.aaCount}` },
        { label: 'Avg residue mass (110 Da)', value: `${v.aaCount} × 110` },
        { label: 'Estimated mass', value: `${avgMassDa.toFixed(0)} Da` },
        { label: 'In kDa', value: `${(avgMassDa / 1000).toFixed(2)} kDa` },
      ]
}
  },
  description: 'Estimate peptide or protein mass from amino acid count using the average residue mass. The average molecular weight of an amino acid residue in a protein is approximately 110 Da.',
  formula: 'Mass ˜ n × 110 Da (average residue weight) | More precisely: S(individual residue masses) + H2O',
  interpretation: 'Mass spectrometry measures precise peptide masses. The average mass estimate helps in interpreting MS/MS spectra and predicting gel migration. For exact mass, sum individual residue masses minus water per peptide bond.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    residues: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'residues', label: 'Number of Amino Acid Residues', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const mwDa = v.residues * 110
    return {
      result: mwDa / 1000, label: 'Molecular Weight', unit: 'kDa',
      steps: [
        { label: 'Residue count', value: `${v.residues}` },
        { label: 'Avg residue mass', value: '110 Da' },
        { label: 'MW = n × 110', value: `${mwDa.toFixed(0)} Da` },
        { label: 'MW (kDa)', value: `${(mwDa / 1000).toFixed(2)} kDa` },
      ]
}
  },
  description: 'Estimate protein molecular weight from residue count using average residue mass of 110 Da. A quick approximation for interpreting gel migration and mass spec data.',
  formula: 'MW (Da) = n × 110 Da | Average protein MW (kDa) ˜ n × 0.11 kDa',
  interpretation: 'Average protein ~300-500 residues (33-55 kDa). Small < 20 kDa, large > 100 kDa. Actual MW varies by exact composition. For precise MW, sum individual residue masses minus water per peptide bond.'
}

export default calcDef

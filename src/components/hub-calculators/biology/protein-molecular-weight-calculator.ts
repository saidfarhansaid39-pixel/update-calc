import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    residues: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    avgMass: z.string().optional()
}),
  fields: [
    { name: 'residues', label: 'Number of Amino Acids', type: 'number', min: 1, step: '1' },
    { name: 'avgMass', label: 'Avg. Residue Mass (optional)', type: 'number', unit: 'Da', min: 100, step: '0.1' },
  ],
  compute: (v) => {
    const avg = v.avgMass || 110
    const mw = v.residues * avg
    return {
      result: mw, label: 'Molecular Weight', unit: 'Da',
      steps: [
        { label: 'Amino acid count', value: `${v.residues}` },
        { label: 'Average residue mass', value: `${avg} Da` },
        { label: 'Molecular weight', value: `${mw.toFixed(0)} Da (${(mw / 1000).toFixed(2)} kDa)` },
        { label: 'Approx. # of atoms', value: `${(mw / 12).toFixed(0)} (rough estimate)` },
      ]
}
  },
  description: 'Protein molecular weight is estimated by multiplying the number of amino acid residues by the average residue mass (~110 Da/amino acid).',
  formula: 'MW (Da) = Number of residues × Average residue mass (~110 Da)',
  interpretation: 'Average protein ~300-500 residues (33-55 kDa). Small proteins < 20 kDa, large proteins > 100 kDa. Actual MW varies by amino acid composition.'
}

export default calcDef

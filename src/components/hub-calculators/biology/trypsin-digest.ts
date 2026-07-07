import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    residues: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    lysArgPct: z.string().optional().refine(v => !v || (parseFloat(v) >= 0 && parseFloat(v) <= 100), '0-100')
}),
  fields: [
    { name: 'residues', label: 'Protein Length (residues)', type: 'number', min: 1, step: '1' },
    { name: 'lysArgPct', label: 'Lys + Arg Content (%, optional)', type: 'number', min: 0, max: 100, step: '0.1' },
  ],
  compute: (v) => {
    const lar = v.lysArgPct || 10
    const sites = Math.round(v.residues * lar / 100)
    const avgLen = sites > 0 ? v.residues / (sites + 1) : v.residues
    return {
      result: avgLen, label: 'Avg Peptide Length', unit: 'residues',
      steps: [
        { label: 'Protein length', value: `${v.residues} aa` },
        { label: 'Lys+Arg content', value: `${lar}%` },
        { label: 'Cleavage sites (estimated)', value: `${sites}` },
        { label: 'Expected # peptides', value: `${sites + 1}` },
        { label: 'Avg peptide length', value: `${avgLen.toFixed(1)} aa` },
        { label: 'Avg peptide mass', value: `${(avgLen * 110).toFixed(0)} Da` },
      ]
}
  },
  description: 'Trypsin specifically cleaves at the C-terminal side of lysine (K) and arginine (R). Estimate digestion products for proteomics sample preparation and mass spec analysis.',
  formula: '# peptides ˜ n(Lys+Arg) + 1 | Avg length = N / (n(K+R) + 1) | Trypsin misses at K-P and R-P bonds',
  interpretation: 'Typical tryptic peptides: 5-25 residues, 500-3000 Da. Complete digestion requires denatured, reduced, alkylated protein. Missed cleavages at KP, RP, and near acidic residues.'
}

export default calcDef

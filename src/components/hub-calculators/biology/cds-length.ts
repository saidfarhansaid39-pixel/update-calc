import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    residues: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'residues', label: 'Number of Amino Acids', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const cdsBp = v.residues * 3
    return {
      result: cdsBp, label: 'CDS Length', unit: 'bp',
      steps: [
        { label: 'Number of amino acids', value: `${v.residues}` },
        { label: 'Each codon = 3 bases', value: '' },
        { label: 'CDS = aa × 3', value: `${cdsBp} bp` },
        { label: 'In kb', value: `${(cdsBp / 1000).toFixed(2)} kb` },
        { label: 'Including stop codon', value: `${cdsBp + 3} bp` },
      ]
}
  },
  description: 'Coding sequence (CDS) length is the number of base pairs from start to stop codon. Each amino acid is encoded by a triplet codon (3 bp). Start codon: ATG, stop codons: TAA/TAG/TGA.',
  formula: 'CDS length (bp) = Number of amino acids × 3 | Average human CDS: ~1,300 bp (433 aa) | Stop codon is not translated but is included in genomic CDS annotation',
  interpretation: 'CDS length varies by protein: histones (~300 bp), average protein (~1.3 kb), titin (~82 kb, largest). Longer CDS means more opportunities for mutations. CDS length determines translation time and energy cost.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pairwiseDiff: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    seqLength: z.string().refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'pairwiseDiff', label: 'Avg Pairwise Differences (p raw)', type: 'number', min: 0, step: '0.01' },
    { name: 'seqLength', label: 'Sequence Length (bp)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const piPerSite = v.seqLength > 0 ? v.pairwiseDiff / v.seqLength : 0
    return {
      result: piPerSite, label: 'Nucleotide Diversity (p)', unit: 'per site',
      steps: [
        { label: 'Avg pairwise differences', value: `${v.pairwiseDiff.toFixed(2)}` },
        { label: 'Sequence length', value: `${v.seqLength} bp` },
        { label: 'p = diff / length', value: `${piPerSite.toFixed(6)}` },
        { label: 'p × 1000', value: `${(piPerSite * 1000).toFixed(2)} per kb` },
      ]
}
  },
  description: 'Nucleotide diversity (p) is the average number of nucleotide differences per site between two randomly chosen sequences in a population. It is the most commonly used measure of genetic diversity.',
  formula: 'p = S(differences between all pairs) / (number of pairs × sequence length)',
  interpretation: 'Higher p indicates greater genetic diversity. Human p ˜ 0.001 (0.1% differences). Drosophila p ˜ 0.005-0.01. Bacteria p ˜ 0.01-0.1. Low p may indicate recent bottleneck or selection.'
}

export default calcDef

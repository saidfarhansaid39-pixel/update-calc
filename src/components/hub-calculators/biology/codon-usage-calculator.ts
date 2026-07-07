import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sequence: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'sequence', label: 'DNA Sequence', type: 'select', options: [
      { label: 'ATGGCTAGCTAGCTAA (sample 1)', value: 'ATGGCTAGCTAGCTAA' },
      { label: 'ATGCGTATCCCGAACT (sample 2)', value: 'ATGCGTATCCCGAACT' },
      { label: 'ATGGAACGTGAATGA (sample 3)', value: 'ATGGAACGTGAATGA' },
    ] },
  ],
  compute: (v) => {
    const seq = v.sequence || 'ATGGCTAGCTAGCTAA'
    const codons: Record<string, number> = {}
    for (let i = 0; i < seq.length - 2; i += 3) {
      const codon = seq.substring(i, i + 3)
      if (codon.length === 3) codons[codon] = (codons[codon] || 0) + 1
    }
    const total = Object.values(codons).reduce((s, c) => s + c, 0)
    return {
      result: total, label: 'Total Codons', unit: '',
      steps: [
        { label: 'Sequence length', value: `${seq.length} bp` },
        { label: 'Total codons', value: `${total}` },
        ...Object.entries(codons).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => ({
          label: `Codon ${c}`, value: `${n} (${(n / total * 100).toFixed(1)}%)`
})),
      ]
}
  },
  description: 'Codon usage analysis reveals the frequency of each codon in a DNA sequence. Codon bias affects gene expression efficiency in different organisms.',
  formula: 'Codon Frequency = Count(codon) / Total codons × 100%',
  interpretation: 'Codon usage bias varies by organism. Highly expressed genes use preferred codons matching abundant tRNAs. Optimizing codon usage can increase recombinant protein yield.'
}

export default calcDef

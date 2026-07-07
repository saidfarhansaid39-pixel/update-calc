import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    exons: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    avgExonLen: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'exons', label: 'Number of Exons', type: 'number', min: 1, step: '1' },
    { name: 'avgExonLen', label: 'Average Exon Length', type: 'number', unit: 'bp', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalExonic = v.exons * v.avgExonLen
    const intronic = totalExonic * 5
    const total = totalExonic + intronic
    return {
      result: total, label: 'Estimated Gene Length (incl. introns)', unit: 'bp',
      steps: [
        { label: 'Exon count', value: `${v.exons}` },
        { label: 'Avg exon size', value: `${v.avgExonLen} bp` },
        { label: 'Total exonic', value: `${totalExonic.toLocaleString()} bp` },
        { label: 'Estimated intronic (~5× exonic)', value: `${intronic.toLocaleString()} bp` },
        { label: 'Total gene length', value: `${total.toLocaleString()} bp (${(total / 1000).toFixed(1)} kb)` },
      ]
}
  },
  description: 'Estimate gene length from exon count and average exon size. Eukaryotic genes consist of exons (coding) interspersed with introns (non-coding) that are typically much larger.',
  formula: 'Gene length ˜ Exons × avg exon size × (1 + intron/exon ratio) | Human avg: 27 kb, 8-9 exons, avg exon ~170 bp, introns ~5× larger',
  interpretation: 'Compact genomes (yeast, prokaryotes) have few/small introns. Human gene size ranges from < 1 kb (histones) to > 2 Mb (dystrophin DMD). Intron size is the main determinant of total gene length.'
}

export default calcDef

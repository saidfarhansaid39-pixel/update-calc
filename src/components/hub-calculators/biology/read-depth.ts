import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mappedReads: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    regionLen: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    readLen: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'mappedReads', label: 'Mapped Reads Count', type: 'number', min: 1, step: '1' },
    { name: 'regionLen', label: 'Target Region Length', type: 'number', unit: 'bp', min: 1, step: '1' },
    { name: 'readLen', label: 'Read Length', type: 'number', unit: 'bp', min: 25, max: 300, step: '1' },
  ],
  compute: (v) => {
    const bases = v.mappedReads * v.readLen
    const depth = bases / v.regionLen
    return {
      result: depth, label: 'Average Read Depth', unit: '×',
      steps: [
        { label: 'Mapped reads', value: `${v.mappedReads.toLocaleString()}` },
        { label: 'Read length', value: `${v.readLen} bp` },
        { label: 'Total bases mapped', value: `${bases.toLocaleString()} bp` },
        { label: 'Region length', value: `${v.regionLen.toLocaleString()} bp` },
        { label: 'Depth = bases / length', value: `${depth.toFixed(1)}×` },
      ]
}
  },
  description: 'Read depth is the number of sequencing reads mapping to each genomic position. Higher depth increases base call confidence and variant detection sensitivity.',
  formula: 'Avg depth = (mapped reads × read length) / target size | = 30× for germline SNV detection; = 0.1× for low-pass CNV',
  interpretation: 'Exome: 100-200×. Targeted panel: 500-1000×. RNA-seq: depth varies; uniform coverage across all targets is critical. Low-depth regions (< 10×) reduce variant calling confidence and increase false negatives.'
}

export default calcDef

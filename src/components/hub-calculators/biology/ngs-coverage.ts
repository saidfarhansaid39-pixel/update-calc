import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    totalReadsM: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    readLength: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    genomeSizeMb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'totalReadsM', label: 'Total Reads', type: 'number', unit: 'M (millions)', min: 0.1, step: '1' },
    { name: 'readLength', label: 'Read Length', type: 'number', unit: 'bp', min: 25, max: 300, step: '1' },
    { name: 'genomeSizeMb', label: 'Reference/Target Size', type: 'number', unit: 'Mb', min: 0.001, step: '1' },
  ],
  compute: (v) => {
    const totalBases = v.totalReadsM * 1e6 * v.readLength
    const coverage = totalBases / (v.genomeSizeMb * 1e6)
    return {
      result: coverage, label: 'Depth of Coverage', unit: '×',
      steps: [
        { label: 'Total reads', value: `${v.totalReadsM} M` },
        { label: 'Read length', value: `${v.readLength} bp` },
        { label: 'Total bases', value: `${(totalBases / 1e9).toFixed(2)} Gb` },
        { label: 'Reference size', value: `${v.genomeSizeMb} Mb` },
        { label: 'Coverage = bases / size', value: `${coverage.toFixed(1)}×` },
      ]
}
  },
  description: 'NGS coverage (depth) is the average number of times each base in the reference genome is sequenced. Adequate depth is critical for confident variant calling and quantification.',
  formula: 'C = (N × L) / G | Coverage = (reads × read length) / genome size | 30× minimum for human WGS germline variant calling',
  interpretation: 'Exome: 100-200× recommended. Targeted panels: 500-1000×. RNA-seq: depth depends on expression. Single-cell: 0.1-1× per cell. Coverage uniformity matters more than mean depth. Use Picard CollectWgsMetrics for assessment.'
}

export default calcDef

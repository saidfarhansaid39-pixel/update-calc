import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    totalReadsM: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    avgQ: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 41 }, '0-41'),
    readLen: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'totalReadsM', label: 'Total Reads', type: 'number', unit: 'M (millions)', min: 0.1, step: '0.1' },
    { name: 'avgQ', label: 'Average Q Score', type: 'number', min: 0, max: 41, step: '1' },
    { name: 'readLen', label: 'Read Length', type: 'number', unit: 'bp', min: 25, max: 300, step: '1' },
  ],
  compute: (v) => {
    const totalBases = v.totalReadsM * 1e6 * v.readLen
    const errorRate = 10 ** (-v.avgQ / 10)
    const qPass = v.avgQ >= 30 ? 'Pass (Q30)' : v.avgQ >= 20 ? 'Pass (Q20)' : 'Fail'
    return {
      result: totalBases / 1e9, label: 'Total Bases', unit: 'Gb',
      steps: [
        { label: 'Total reads', value: `${v.totalReadsM} M` },
        { label: 'Read length', value: `${v.readLen} bp` },
        { label: 'Total bases', value: `${(totalBases / 1e9).toFixed(2)} Gb` },
        { label: 'Mean Q-score', value: `Q${v.avgQ} (${qPass})` },
        { label: 'Error rate', value: `${(errorRate * 100).toExponential(2)}%` },
        { label: 'Expected errors', value: `${(totalBases * errorRate).toFixed(0)} bases` },
      ]
}
  },
  description: 'FASTQ statistics summarize sequencing data quality: total bases, per-base quality (Q-scores), and expected error rate. Q = 30 (99.9% accuracy) is the standard for reliable base calling.',
  formula: 'Total bases = reads × read length | Error rate = 10^(-Q/10) | Q30 = 99.9% accuracy, Q20 = 99% accuracy | Illumina: = 80% bases at Q30 is typical',
  interpretation: 'Low Q-scores indicate sequencing problems: phasing/pre-phasing, bubble formation, or library overloading. Q-score drops toward the end of reads. Trimming low-quality bases improves alignment rates and variant calling.'
}

export default calcDef

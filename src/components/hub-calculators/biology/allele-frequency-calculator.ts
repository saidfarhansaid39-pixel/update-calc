import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    dominant: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    recessive: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'dominant', label: 'Dominant Phenotype Count', type: 'number', min: 0, step: '1' },
    { name: 'recessive', label: 'Recessive Phenotype Count', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const total = v.dominant + v.recessive
    const recFreq = total > 0 ? Math.sqrt(v.recessive / total) : 0
    const domFreq = 1 - recFreq
    const p2 = total > 0 ? domFreq * domFreq : 0
    const pq = total > 0 ? 2 * domFreq * recFreq : 0
    const q2 = total > 0 ? recFreq * recFreq : 0
    return {
      result: domFreq, label: 'Dominant Allele (p)', unit: '',
      steps: [
        { label: 'Total individuals', value: `${total}` },
        { label: 'Recessive freq (q²)', value: `${total > 0 ? (v.recessive / total).toFixed(4) : '—'}` },
        { label: 'q', value: `${recFreq.toFixed(4)}` },
        { label: 'p', value: `${domFreq.toFixed(4)}` },
        { label: 'Expected AA (p²)', value: `${(p2 * total).toFixed(1)} (${(p2 * 100).toFixed(1)}%)` },
        { label: 'Expected Aa (2pq)', value: `${(pq * total).toFixed(1)} (${(pq * 100).toFixed(1)}%)` },
        { label: 'Expected aa (q²)', value: `${(q2 * total).toFixed(1)} (${(q2 * 100).toFixed(1)}%)` },
      ]
}
  },
  description: 'Allele frequencies are calculated from observed phenotype counts assuming Hardy-Weinberg equilibrium. Track genetic variation in populations over time.',
  formula: 'q = v(recessive/total) | p = 1 – q | p² + 2pq + q² = 1',
  interpretation: 'Allele frequencies range from 0 to 1. Sum of all allele frequencies for a gene = 1. Changes in allele frequency across generations indicate evolution.'
}

export default calcDef

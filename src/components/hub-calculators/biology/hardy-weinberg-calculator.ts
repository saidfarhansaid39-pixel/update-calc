import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1'),
    q: z.string().optional().refine(v => !v || (parseFloat(v) >= 0 && parseFloat(v) <= 1), '0-1')
}),
  fields: [
    { name: 'p', label: 'p (Allele A frequency)', type: 'number', min: 0, max: 1, step: '0.01' },
    { name: 'q', label: 'q (Allele a frequency, optional)', type: 'number', min: 0, max: 1, step: '0.01' },
  ],
  compute: (v) => {
    const p = v.p
    const q = v.q || (1 - p)
    const p2 = p * p
    const q2 = q * q
    const pq = 2 * p * q
    return {
      result: p2, label: 'p² (AA frequency)', unit: '',
      steps: [
        { label: 'p', value: `${p.toFixed(3)}` },
        { label: 'q', value: `${q.toFixed(3)}` },
        { label: 'p² (AA)', value: `${p2.toFixed(3)} = ${(p2 * 100).toFixed(1)}%` },
        { label: '2pq (Aa)', value: `${pq.toFixed(3)} = ${(pq * 100).toFixed(1)}%` },
        { label: 'q² (aa)', value: `${q2.toFixed(3)} = ${(q2 * 100).toFixed(1)}%` },
      ]
}
  },
  description: 'The Hardy-Weinberg principle describes allele and genotype frequencies in a non-evolving population under equilibrium conditions.',
  formula: 'p + q = 1 | p² + 2pq + q² = 1',
  interpretation: 'Hardy-Weinberg equilibrium requires: no mutation, random mating, no selection, infinite population size, no gene flow. Deviation indicates evolutionary forces.'
}

export default calcDef

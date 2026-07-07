import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p: z.string().refine(v => { const n = parseFloat(v); return n > 0 && n < 1 }, '0-1 excl')
}),
  fields: [
    { name: 'p', label: 'Frequency of Dominant Allele (p)', type: 'number', min: 0.01, max: 0.99, step: '0.01' },
  ],
  compute: (v) => {
    const pVal = v.p; const qVal = 1 - pVal
    const p2 = pVal * pVal; const pq2 = 2 * pVal * qVal; const q2 = qVal * qVal
    return {
      result: p2 * 100, label: 'f(AA) = p²', unit: '%',
      steps: [
        { label: 'p (dominant allele)', value: `${pVal.toFixed(3)}` },
        { label: 'q = 1 - p (recessive allele)', value: `${qVal.toFixed(3)}` },
        { label: 'p + q', value: `${(pVal+qVal).toFixed(1)} (should = 1)` },
        { label: 'p² (AA genotype)', value: `${(p2*100).toFixed(1)}%` },
        { label: '2pq (Aa genotype)', value: `${(pq2*100).toFixed(1)}%` },
        { label: 'q² (aa genotype)', value: `${(q2*100).toFixed(1)}%` },
        { label: 'p² + 2pq + q²', value: `${((p2+pq2+q2)*100).toFixed(1)}% (should = 100%)` },
      ]
}
  },
  description: 'Hardy-Weinberg equilibrium describes the relationship between allele frequencies and genotype frequencies in a non-evolving population. It serves as the null model for population genetics.',
  formula: 'p + q = 1 | p² + 2pq + q² = 1 | Assumes random mating, no selection, no mutation, no migration, infinite population size',
  interpretation: 'Deviation from HW equilibrium suggests evolutionary forces at work: natural selection, genetic drift, gene flow, non-random mating, or mutation.'
}

export default calcDef

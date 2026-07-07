import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    homDom: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '>=0'),
    het: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '>=0'),
    homRec: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'homDom', label: 'AA (homozygous dominant)', type: 'number', min: 0, step: '1' },
    { name: 'het', label: 'Aa (heterozygous)', type: 'number', min: 0, step: '1' },
    { name: 'homRec', label: 'aa (homozygous recessive)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const n = v.homDom + v.het + v.homRec
    const p = n > 0 ? (2 * v.homDom + v.het) / (2 * n) : 0
    const q = 1 - p
    return {
      result: p, label: 'Allele A Frequency (p)', unit: '',
      steps: [
        { label: 'Total individuals', value: `${n}` },
        { label: 'A alleles', value: `${2 * v.homDom + v.het} (2×AA + Aa)` },
        { label: 'p = A / total alleles', value: `${p.toFixed(4)}` },
        { label: 'q = 1 - p', value: `${q.toFixed(4)}` },
        { label: 'Expected AA = p²', value: `${(p * p * 100).toFixed(1)}%` },
        { label: 'Expected Aa = 2pq', value: `${(2 * p * q * 100).toFixed(1)}%` },
        { label: 'Expected aa = q²', value: `${(q * q * 100).toFixed(1)}%` },
      ]
}
  },
  description: 'Calculate allele frequencies (p and q) from observed genotype counts. This is the foundation of population genetics analysis under Hardy-Weinberg assumptions.',
  formula: 'p = (2×nAA + nAa) / (2×N) | q = 1 - p | HW: p²(AA) + 2pq(Aa) + q²(aa) = 1',
  interpretation: 'Allele frequencies range from 0 to 1 and sum to 1. Used to track genetic changes across generations. Deviations from HW expectations suggest selection, drift, or non-random mating.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p1: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1')
}),
  fields: [
    { name: 'p1', label: 'Frequency of Allele 1', type: 'number', min: 0, max: 1, step: '0.01' },
  ],
  compute: (v) => {
    const p = v.p1; const q = 1 - p
    const h11 = p * p; const h12 = 2 * p * q; const h22 = q * q
    return {
      result: h12 * 100, label: 'Heterozygote Frequency', unit: '%',
      steps: [
        { label: 'p(allele 1)', value: `${p.toFixed(3)}` },
        { label: 'q(allele 2)', value: `${q.toFixed(3)}` },
        { label: 'f(11) = p²', value: `${(h11*100).toFixed(1)}%` },
        { label: 'f(12) = 2pq (intermediate)', value: `${(h12*100).toFixed(1)}%` },
        { label: 'f(22) = q²', value: `${(h22*100).toFixed(1)}%` },
      ]
}
  },
  description: 'Incomplete dominance produces a blended intermediate phenotype in heterozygotes. Snapdragon flower color is a classic example.',
  formula: 'AA = phenotype 1, Aa = intermediate, aa = phenotype 2 | f(AA)=p², f(Aa)=2pq, f(aa)=q²',
  interpretation: 'Unlike complete dominance, the heterozygote shows a distinct intermediate phenotype. The ratio is 1:2:1 for monohybrid crosses of heterozygotes.'
}

export default calcDef

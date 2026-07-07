import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pA: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1'),
    pB: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1')
}),
  fields: [
    { name: 'pA', label: 'Frequency of Allele A', type: 'number', min: 0, max: 1, step: '0.01' },
    { name: 'pB', label: 'Frequency of Allele B', type: 'number', min: 0, max: 1, step: '0.01' },
  ],
  compute: (v) => {
    const pa = v.pA; const pb = v.pB
    const fAA = pa * pa; const fAB = 2 * pa * pb; const fBB = pb * pb
    return {
      result: fAB * 100, label: 'Heterozygote Frequency (AB)', unit: '%',
      steps: [
        { label: 'p(A)', value: `${pa.toFixed(3)}` },
        { label: 'p(B)', value: `${pb.toFixed(3)}` },
        { label: 'f(AA) = p²', value: `${(fAA*100).toFixed(1)}%` },
        { label: 'f(AB) = 2pq', value: `${(fAB*100).toFixed(1)}%` },
        { label: 'f(BB) = q²', value: `${(fBB*100).toFixed(1)}%` },
      ]
}
  },
  description: 'Codominant inheritance means both alleles are fully expressed in heterozygotes. ABO blood type is a classic example of codominance.',
  formula: 'f(AA) = p², f(AB) = 2pq, f(BB) = q² under Hardy-Weinberg equilibrium',
  interpretation: 'Codominant markers show both alleles in heterozygotes. This contrasts with dominant/recessive patterns. Genotype and phenotype are identical for codominant traits.'
}

export default calcDef

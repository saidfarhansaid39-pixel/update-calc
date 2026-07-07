import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    countAA: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    countAa: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    countAa2: z.string().refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'countAA', label: 'AA Genotype Count', type: 'number', min: 0, step: '1' },
    { name: 'countAa', label: 'Aa Genotype Count', type: 'number', min: 0, step: '1' },
    { name: 'countAa2', label: 'aa Genotype Count', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const total = v.countAA + v.countAa + v.countAa2
    const fAA = total > 0 ? v.countAA / total : 0
    const fAa = total > 0 ? v.countAa / total : 0
    const faa = total > 0 ? v.countAa2 / total : 0
    const pVal = fAA + fAa / 2; const qVal = 1 - pVal
    return {
      result: fAA * 100, label: 'AA Frequency', unit: '%',
      steps: [
        { label: 'Total individuals', value: `${total}` },
        { label: 'f(AA)', value: `${(fAA*100).toFixed(1)}%` },
        { label: 'f(Aa)', value: `${(fAa*100).toFixed(1)}%` },
        { label: 'f(aa)', value: `${(faa*100).toFixed(1)}%` },
        { label: 'p(A) from counts', value: `${(pVal).toFixed(3)}` },
        { label: 'q(a) from counts', value: `${(qVal).toFixed(3)}` },
      ]
}
  },
  description: 'Calculate observed genotype frequencies from population count data. Compare to Hardy-Weinberg expected frequencies to detect evolutionary forces.',
  formula: 'f(AA) = n(AA)/N, f(Aa) = n(Aa)/N, f(aa) = n(aa)/N | p = f(AA) + f(Aa)/2, q = 1 - p',
  interpretation: 'Observed frequencies that differ significantly from HW expectation suggest selection, drift, non-random mating, or genotyping error.'
}

export default calcDef

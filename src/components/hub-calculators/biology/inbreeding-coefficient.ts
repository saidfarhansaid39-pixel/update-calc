import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    fValue: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1')
}),
  fields: [
    { name: 'fValue', label: 'Inbreeding Coefficient (F)', type: 'number', min: 0, max: 1, step: '0.01' },
  ],
  compute: (v) => {
    const f = v.fValue
    const hoRatio = 1 - f
    return {
      result: f * 100, label: 'Inbreeding Coefficient (F)', unit: '%',
      steps: [
        { label: 'F value', value: `${f.toFixed(3)}` },
        { label: 'Expected vs HW heterozygosity', value: `Hobs/Hexp = ${hoRatio.toFixed(3)}` },
        { label: 'Heterozygote deficit', value: `${(f*100).toFixed(1)}%` },
        { label: 'Interpretation', value: f < 0.05 ? 'Low inbreeding' : f < 0.15 ? 'Moderate' : f < 0.25 ? 'High' : 'Very high inbreeding' },
      ]
}
  },
  description: 'Wright\'s inbreeding coefficient (F) measures the probability that two alleles at a locus are identical by descent. It quantifies the reduction in heterozygosity due to inbreeding.',
  formula: 'F = (Hexp - Hobs) / Hexp | Ho = Hexp × (1 - F) | For an offspring of full-sib mating: F = 0.25',
  interpretation: 'F = 0: random mating. F = 0.25: parent-offspring or full-sib mating. F > 0.1 may indicate significant inbreeding depression. F > 0.25 indicates very close inbreeding.'
}

export default calcDef

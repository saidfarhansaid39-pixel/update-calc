import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    substitutions: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    generations: z.string().refine(v => parseInt(v) > 0, '>0'),
    sites: z.string().refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'substitutions', label: 'Observed Substitutions', type: 'number', min: 0, step: '1' },
    { name: 'generations', label: 'Generations', type: 'number', min: 1, step: '1' },
    { name: 'sites', label: 'Number of Sites', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const mutationRate = v.sites > 0 ? v.substitutions / (v.generations * v.sites) : 0
    return {
      result: mutationRate, label: 'Mutation Rate (µ)', unit: 'per site per generation',
      steps: [
        { label: 'Substitutions observed', value: `${v.substitutions}` },
        { label: 'Generations', value: `${v.generations}` },
        { label: 'Sites monitored', value: `${v.sites}` },
        { label: 'µ', value: `${mutationRate.toExponential(4)}` },
        { label: 'Per genome per generation', value: `${(mutationRate * v.sites).toExponential(4)}` },
      ]
}
  },
  description: 'Mutation rate (µ) is the probability of a mutation occurring per site per generation. It is a fundamental parameter in population genetics and molecular evolution.',
  formula: 'µ = S / (G × L), where S = substitutions, G = generations, L = sites | Per genome: µ × L',
  interpretation: 'Typical mutation rates: 10?8 per site per generation in eukaryotes, 10?¹° in bacteria, 10?5 in RNA viruses. Higher rates increase genetic diversity and disease risk.'
}

export default calcDef

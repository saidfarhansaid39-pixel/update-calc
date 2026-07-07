import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pattern: z.string()
}),
  fields: [
    { name: 'pattern', label: 'Inheritance Pattern', type: 'select', options: [
      { label: 'Autosomal Dominant', value: 'AD' },
      { label: 'Autosomal Recessive', value: 'AR' },
      { label: 'X-linked Dominant', value: 'XD' },
      { label: 'X-linked Recessive', value: 'XR' },
    ] },
  ],
  compute: (v) => {
    const info: Record<string,{risk:string,features:string}> = {
      'AD': { risk: '50% for offspring if one parent affected', features: 'Affects both sexes. Multiple generations affected. Male-to-male transmission seen. Affected individuals have one mutant allele.' },
      'AR': { risk: '25% for offspring of two carriers', features: 'Affects both sexes. Often skips generations. Inbreeding increases risk. Both parents must carry mutation.' },
      'XD': { risk: '50% for all children of affected female; all daughters of affected male', features: 'Both sexes affected. No male-to-male transmission. Affected males pass to all daughters but no sons.' },
      'XR': { risk: '50% sons of carrier mothers affected', features: 'Primarily males affected. No male-to-male transmission. Carrier females usually unaffected.' }
}
    const d = info[v.pattern] || info['AD']
    return {
      result: 50, label: 'Offspring Risk Estimate', unit: '%',
      steps: [
        { label: 'Inheritance pattern', value: v.pattern },
        { label: 'Recurrence risk', value: d.risk },
        { label: 'Key features', value: d.features },
      ]
}
  },
  description: 'Pedigree analysis identifies inheritance patterns of genetic disorders within families. Accurate pattern recognition guides genetic counseling and recurrence risk assessment.',
  formula: 'Pattern recognition based on affected vs unaffected individuals across generations, sex distribution, and parent-to-offspring transmission.',
  interpretation: 'Autosomal dominant: vertical transmission. Autosomal recessive: horizontal (sibling) clusters. X-linked: no male-to-male. Mitochondrial: maternal transmission only.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    parent1: z.string(),
    parent2: z.string()
}),
  fields: [
    { name: 'parent1', label: 'Parent 1 Genotype', type: 'select', options: [
      { label: 'AA (homozygous dominant)', value: 'AA' },
      { label: 'Aa (heterozygous)', value: 'Aa' },
      { label: 'aa (homozygous recessive)', value: 'aa' },
    ] },
    { name: 'parent2', label: 'Parent 2 Genotype', type: 'select', options: [
      { label: 'AA (homozygous dominant)', value: 'AA' },
      { label: 'Aa (heterozygous)', value: 'Aa' },
      { label: 'aa (homozygous recessive)', value: 'aa' },
    ] },
  ],
  compute: (v) => {
    const gametes = (g: string) => g === 'AA' ? ['A', 'A'] : g === 'aa' ? ['a', 'a'] : ['A', 'a']
    const g1 = gametes(v.parent1 || 'AA')
    const g2 = gametes(v.parent2 || 'AA')
    const outcomes: Record<string, number> = {}
    for (const a of g1) {
      for (const b of g2) {
        const key = [a, b].sort().join('')
        outcomes[key] = (outcomes[key] || 0) + 1
      }
    }
    const total = Object.values(outcomes).reduce((s, c) => s + c, 0)
    const dom = ((outcomes['AA'] || 0) + (outcomes['Aa'] || 0)) / total * 100
    const rec = (outcomes['aa'] || 0) / total * 100
    return {
      result: dom, label: 'Dominant Phenotype', unit: '%',
      steps: [
        { label: 'P1 gametes', value: `${g1.join(',')}` },
        { label: 'P2 gametes', value: `${g2.join(',')}` },
        ...Object.entries(outcomes).map(([g, c]) => ({ label: `Genotype ${g}`, value: `${(c / total * 100).toFixed(0)}%` })),
        { label: 'Dominant phenotype', value: `${dom.toFixed(0)}%` },
        { label: 'Recessive phenotype', value: `${rec.toFixed(0)}%` },
      ]
}
  },
  description: 'A Punnett square predicts the genotypic and phenotypic ratios of offspring from a genetic cross between two parents with known genotypes.',
  formula: 'For Aa × Aa: 1 AA : 2 Aa : 1 aa = 3:1 phenotypic ratio',
  interpretation: 'The Punnett square shows all possible combinations of parental alleles. For a monohybrid cross of heterozygotes, the phenotypic ratio is 3:1 (dominant:recessive).'
}

export default calcDef

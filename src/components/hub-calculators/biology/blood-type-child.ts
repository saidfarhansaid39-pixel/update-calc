import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    motherABO: z.string(), fatherABO: z.string(), motherRh: z.string(), fatherRh: z.string()
}),
  fields: [
    { name: 'motherABO', label: 'Mother ABO', type: 'select', options: [
      { label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'AB', value: 'AB' }, { label: 'O', value: 'O' },
    ] },
    { name: 'fatherABO', label: 'Father ABO', type: 'select', options: [
      { label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'AB', value: 'AB' }, { label: 'O', value: 'O' },
    ] },
    { name: 'motherRh', label: 'Mother Rh', type: 'select', options: [
      { label: 'Positive (+)', value: '+' }, { label: 'Negative (-)', value: '-' },
    ] },
    { name: 'fatherRh', label: 'Father Rh', type: 'select', options: [
      { label: 'Positive (+)', value: '+' }, { label: 'Negative (-)', value: '-' },
    ] },
  ],
  compute: (v) => {
    const aboMap: Record<string, string[]> = {
      'A': ['A','O'], 'B': ['B','O'], 'AB': ['A','B'], 'O': ['O','O']
}
    const mA = aboMap[v.motherABO] || ['O','O']
    const fA = aboMap[v.fatherABO] || ['O','O']
    const aboGenotypes: string[] = []
    for (const a of mA) { for (const b of fA) {
      const abo = [a,b].sort().join('')
      aboGenotypes.push(abo)
      if (a === 'O' && b === 'O') aboGenotypes.push('O')
    }}
    const aboCounts: Record<string,number> = {}
    const aboPheno: Record<string,string> = { 'AA':'A','AO':'A','BB':'B','BO':'B','AB':'AB','OO':'O' }
    for (const g of aboGenotypes) { const ph = aboPheno[g] || g; aboCounts[ph] = (aboCounts[ph]||0)+1 }
    const total = Object.values(aboCounts).reduce((s,c)=>s+c,0)
    const rhNeg = v.motherRh === '-' && v.fatherRh === '-' ? '100% Rh-' : v.motherRh === '+' && v.fatherRh === '+' ? '~75% Rh+, ~25% Rh-' : '~50% Rh+, ~50% Rh-'
    return {
      result: total > 0 ? (aboCounts['A']||0)/total*100 : 0, label: 'Most Likely ABO', unit: '%',
      steps: [
        ...Object.entries(aboCounts).map(([ph,c]) => ({ label: `Type ${ph}`, value: `${(c/total*100).toFixed(0)}%` })),
        { label: 'Rh prediction', value: rhNeg },
      ]
}
  },
  description: 'Predict possible blood types for a child based on parents\' ABO and Rh blood types. ABO and Rh are the two most clinically significant blood group systems.',
  formula: 'ABO: A/B are codominant, O is recessive | Rh: + (D antigen) is dominant over -',
  interpretation: 'ABO blood type is inherited with A and B codominant to each other and both dominant over O. Rh positive is dominant over Rh negative. This calculator gives possible outcomes, not guarantees.'
}

export default calcDef

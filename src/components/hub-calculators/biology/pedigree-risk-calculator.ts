import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pattern: z.string(),
    parentCarrier: z.string()
}),
  fields: [
    { name: 'pattern', label: 'Inheritance Pattern', type: 'select', options: [
      { label: 'Autosomal Dominant', value: 'AD' },
      { label: 'Autosomal Recessive', value: 'AR' },
      { label: 'X-linked Recessive', value: 'XR' },
    ] },
    { name: 'parentCarrier', label: 'One Parent is a Carrier', type: 'select', options: [
      { label: 'Yes — one parent affected/carrier', value: 'yes' },
      { label: 'No — neither parent is affected', value: 'no' },
      { label: 'Both parents are carriers (AR only)', value: 'both' },
    ] },
  ],
  compute: (v) => {
    const pattern = v.pattern || 'AD'
    const pCarrier = v.parentCarrier || 'no'
    let risk = 0
    let details = ''
    if (pattern === 'AD') {
      risk = pCarrier === 'yes' ? 50 : 0.1
      details = pCarrier === 'yes' ? '50% chance for each child' : 'Low risk (new mutation possible)'
    } else if (pattern === 'AR') {
      risk = pCarrier === 'both' ? 25 : pCarrier === 'yes' ? 0 : 0.1
      details = pCarrier === 'both' ? '25% for each child' : pCarrier === 'yes' ? '~0% (needs both carriers)' : 'Population risk level'
    } else if (pattern === 'XR') {
      risk = pCarrier === 'yes' ? 25 : 0.1
      details = pCarrier === 'yes' ? '50% of sons affected, 50% of daughters carriers' : 'Population risk'
    }
    return {
      result: risk, label: 'Inheritance Risk', unit: '%',
      steps: [
        { label: 'Inheritance pattern', value: `${pattern}` },
        { label: 'Parental status', value: `${pCarrier}` },
        { label: 'Risk per pregnancy', value: `${risk}%` },
        { label: 'Details', value: details },
      ]
}
  },
  description: 'Pedigree risk analysis calculates the probability of inheriting a genetic condition based on the inheritance pattern and parental genetic status.',
  formula: 'AD (one affected parent): 50% | AR (both carriers): 25% | XR (carrier mother): 50% sons affected',
  interpretation: 'Risk percentages are per pregnancy. Actual outcomes vary. Genetic counseling provides personalized risk assessment based on detailed family history and testing.'
}

export default calcDef

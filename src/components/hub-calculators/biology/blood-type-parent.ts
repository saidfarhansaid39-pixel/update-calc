import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    childABO: z.string(), childRh: z.string()
}),
  fields: [
    { name: 'childABO', label: 'Child ABO', type: 'select', options: [
      { label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'AB', value: 'AB' }, { label: 'O', value: 'O' },
    ] },
    { name: 'childRh', label: 'Child Rh', type: 'select', options: [
      { label: 'Positive (+)', value: '+' }, { label: 'Negative (-)', value: '-' },
    ] },
  ],
  compute: (v) => {
    const possible: Record<string,string> = {
      'A': 'A or AB (if both parents A) | A or O (if one parent O) | any ABO possible',
      'B': 'B or AB (if both parents B) | B or O (if one parent O) | any ABO possible',
      'AB': 'Cannot have AB if either parent is O | Parents must carry A and B alleles',
      'O': 'Both parents must carry at least one O allele | Neither parent can be AB'
}
    const rhInfo = v.childRh === '+' ? 'At least one parent must be Rh+. Both could be Rh+ or one Rh+ one Rh-.' : 'Both parents must carry at least one Rh- allele. Both could be Rh- or one Rh- one Rh+ with Rh- child (25% chance).'
    return {
      result: 0, label: 'Parent ABO Possibilities', unit: '',
      steps: [
        { label: 'Child ABO', value: v.childABO },
        { label: 'Possible parent ABO', value: possible[v.childABO] || 'Unknown' },
        { label: 'Rh note', value: rhInfo },
      ]
}
  },
  description: 'Infer possible parental blood types from a child\'s blood type. Useful for understanding inheritance patterns in family studies.',
  formula: 'Each parent contributes one ABO allele. A and B are codominant; O is recessive. Rh+ is dominant over Rh-.',
  interpretation: 'ABO and Rh inheritance follow Mendelian patterns. Some parental combinations are impossible given a child\'s type. This provides likely scenarios, not definitive parentage determination.'
}

export default calcDef

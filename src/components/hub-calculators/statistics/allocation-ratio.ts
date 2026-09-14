import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n1: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1'), n2: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1') }),
  fields: [{ name: 'n1', label: 'Group 1 Size', type: 'number', min: 1, step: '1' }, { name: 'n2', label: 'Group 2 Size', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const ratio = n(v.n1) / n(v.n2); const de = (ratio + 1) / (2 * ratio); return { result: ratio, label: 'Allocation Ratio', unit: '', steps: [{ label: 'N1 / N2', value: `${ratio.toFixed(3)}` }, { label: 'Design effect', value: `${de.toFixed(3)}` }] ,
    extras: [
      { label: "Assumption check", value: "Verify your data meets the assumptions of this test before drawing conclusions." },
      { label: "Sample size note", value: "Larger samples provide more reliable estimates." },
      { label: "Effect size", value: "Consider reporting effect size alongside p-value for complete interpretation." }
    ]} },
  description: 'The allocation ratio determines how subjects are distributed between groups. Unequal ratios may be used for cost or ethical reasons.',
  formula: 'r = n₁ / n₂, Design effect = (r+1) / (2r)',
  interpretation: 'r = 1 gives equal allocation (most efficient). r = 2 means twice as many in group 1. Unequal allocation reduces statistical power.'
}

export default calcDef

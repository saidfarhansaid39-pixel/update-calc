import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ data: z.string().min(1, 'Required') }),
  fields: [{ name: 'data', label: 'Data layout (comma separated, factor A then B)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.data); const grandMean = nums.reduce((a, b) => a + b, 0) / nums.length; const ss = nums.reduce((acc, x) => acc + (x - grandMean) ** 2, 0); return { result: ss, label: 'Total SS', unit: '', steps: [{ label: 'N', value: `${nums.length}` }, { label: 'Grand mean', value: `${grandMean.toFixed(4)}` }, { label: 'Total SS', value: `${ss.toFixed(4)}` }] } },
  description: 'Two-way ANOVA analyzes the effects of two categorical factors on a continuous response, including interaction effects.',
  formula: 'SS_total = SS_A + SS_B + SS_AB + SS_error',
  interpretation: 'Main effects (factor A, factor B) and interaction effect (A×B) are tested simultaneously.'
}

export default calcDef

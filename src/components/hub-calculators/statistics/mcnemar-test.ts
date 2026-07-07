import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ b: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), c: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [{ name: 'b', label: 'Discordant (before=1, after=0)', type: 'number', min: 0, step: '1' }, { name: 'c', label: 'Discordant (before=0, after=1)', type: 'number', min: 0, step: '1' }],
  compute: (v) => { const bVal = n(v.b); const cVal = n(v.c); const chi2 = (bVal + cVal) > 0 ? ((bVal - cVal) ** 2) / (bVal + cVal) : 0; return { result: chi2, label: 'McNemar χ²', unit: '', steps: [{ label: 'b (1→0)', value: `${bVal}` }, { label: 'c (0→1)', value: `${cVal}` }, { label: 'χ²', value: `${chi2.toFixed(4)}` }] } },
  description: 'McNemar\'s test assesses marginal homogeneity in paired binary data (before-after, matched pairs).',
  formula: 'χ² = (b - c)² / (b + c), where b and c are discordant pairs',
  interpretation: 'Tests whether the proportion of discordant pairs is symmetric. Used in matched case-control studies.'
}

export default calcDef

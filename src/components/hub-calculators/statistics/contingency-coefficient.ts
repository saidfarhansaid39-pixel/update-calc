import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ chi2: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), n: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [{ name: 'chi2', label: 'χ² statistic', type: 'number', min: 0, step: 'any' }, { name: 'n', label: 'Total N', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const chi2 = n(v.chi2); const nVal = n(v.n); const cc = Math.sqrt(chi2 / (chi2 + nVal)); return { result: cc, label: 'Contingency Coefficient', unit: '', steps: [{ label: 'χ²', value: `${chi2.toFixed(4)}` }, { label: 'N', value: `${nVal}` }, { label: 'C', value: `${cc.toFixed(4)}` }] } },
  description: 'The contingency coefficient measures association in cross-tabulations. It is based on the chi-square statistic.',
  formula: 'C = √(χ² / (χ² + n))',
  interpretation: 'C ranges from 0 to < 1. Upper bound depends on table dimensions. Cramer\'s V is preferred for comparing across tables.'
}

export default calcDef

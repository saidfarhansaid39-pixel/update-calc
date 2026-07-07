import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ a: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), b: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), c: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), d: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [{ name: 'a', label: 'Cell a (both 1)', type: 'number', min: 0, step: '1' }, { name: 'b', label: 'Cell b (X=1, Y=0)', type: 'number', min: 0, step: '1' }, { name: 'c', label: 'Cell c (X=0, Y=1)', type: 'number', min: 0, step: '1' }, { name: 'd', label: 'Cell d (both 0)', type: 'number', min: 0, step: '1' }],
  compute: (v) => { const aVal = n(v.a); const bVal = n(v.b); const cVal = n(v.c); const dVal = n(v.d); const total = aVal + bVal + cVal + dVal; const den = Math.sqrt((aVal + bVal) * (cVal + dVal) * (aVal + cVal) * (bVal + dVal)); const phi = den > 0 ? (aVal * dVal - bVal * cVal) / den : 0; return { result: phi, label: 'φ Coefficient', unit: '', steps: [{ label: 'N', value: `${total}` }, { label: 'φ', value: `${phi.toFixed(4)}` }, { label: 'Interpretation', value: Math.abs(phi) >= 0.5 ? 'Strong' : Math.abs(phi) >= 0.3 ? 'Moderate' : Math.abs(phi) >= 0.1 ? 'Weak' : 'Negligible' }] } },
  description: 'Phi coefficient measures the association between two binary variables in a 2×2 contingency table.',
  formula: 'φ = (ad - bc) / √((a+b)(c+d)(a+c)(b+d))',
  interpretation: 'φ ranges from -1 to +1. φ = 0 indicates no association. For larger tables, use Cramer\'s V.'
}

export default calcDef

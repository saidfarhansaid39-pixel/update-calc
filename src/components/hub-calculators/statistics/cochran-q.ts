import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ condition1: z.string().min(1, 'Required'), condition2: z.string().min(1, 'Required'), condition3: z.string().min(1, 'Required') }),
  fields: [{ name: 'condition1', label: 'Condition 1 (0/1, comma separated)', type: 'number', step: 'any' }, { name: 'condition2', label: 'Condition 2 (0/1, comma separated)', type: 'number', step: 'any' }, { name: 'condition3', label: 'Condition 3 (0/1, comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const c1 = parseList(v.condition1); const c2 = parseList(v.condition2); const c3 = parseList(v.condition3); if (c1.length !== c2.length || c1.length !== c3.length || c1.length < 2) return { result: 'Need ≥2 subjects', label: '', unit: '', steps: [] }; const n = c1.length; const k = 3; const colSums = [c1.reduce((a, b) => a + b, 0), c2.reduce((a, b) => a + b, 0), c3.reduce((a, b) => a + b, 0)]; const rowSums = c1.map((_, i) => c1[i] + c2[i] + c3[i]); const grandSum = colSums.reduce((a, b) => a + b, 0); const num = (k - 1) * (k * colSums.reduce((acc, g) => acc + g * g, 0) - grandSum * grandSum); const den = k * grandSum - rowSums.reduce((acc, r) => acc + r * r, 0); const Q = den > 0 ? num / den : 0; return { result: Q, label: 'Cochran Q', unit: '', steps: [{ label: 'Col sums', value: colSums.join(', ') }, { label: 'Q', value: `${Q.toFixed(4)}` }] } },
  description: 'Cochran\'s Q test is a non-parametric test for differences in dichotomous outcomes across three or more matched groups.',
  formula: 'Q = (k-1)(kΣGⱼ² - G²) / (kG - ΣRᵢ²)',
  interpretation: 'Q approximately follows χ² with k-1 DF. Used for repeated measures of binary outcomes (e.g., correct/incorrect across test items).'
}

export default calcDef

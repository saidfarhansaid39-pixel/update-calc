import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ margin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), supportVectors: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1'), cParam: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'margin', label: 'Separation Margin', type: 'number', min: 0.001, step: 'any' }, { name: 'supportVectors', label: 'Support Vectors Count', type: 'number', min: 1, step: '1' }, { name: 'cParam', label: 'C (regularization)', type: 'number', min: 0.001, step: '0.1' }],
  compute: (v) => { const margin = n(v.margin); const sv = Math.round(n(v.supportVectors)); const c = n(v.cParam); const wNorm = 2 / margin; const hingeLoss = Math.max(0, 1 - margin); const objective = 0.5 * wNorm * wNorm + c * sv * hingeLoss; return { result: objective, label: 'SVM Objective', unit: '', steps: [{ label: 'Margin', value: `${margin.toFixed(4)}` }, { label: 'Support vectors', value: `${sv}` }, { label: 'C', value: `${c}` }, { label: 'Objective', value: `${objective.toExponential(4)}` }] } },
  description: 'Support Vector Machine finds the hyperplane that maximally separates classes, using support vectors.',
  formula: 'min ½||w||² + CΣξᵢ, subject to yᵢ(w·xᵢ + b) ≥ 1 - ξᵢ',
  interpretation: 'C controls the trade-off between margin width and misclassification. Kernel trick enables non-linear decision boundaries.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ treatEffect: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), controlEffect: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), margin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), se: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'treatEffect', label: 'Treatment Effect', type: 'number', step: 'any' }, { name: 'controlEffect', label: 'Control Effect', type: 'number', step: 'any' }, { name: 'margin', label: 'Non-inferiority Margin (δ)', type: 'number', min: 0.001, step: 'any' }, { name: 'se', label: 'Standard Error', type: 'number', min: 0.001, step: 'any' }],
  compute: (v) => { const diff = n(v.treatEffect) - n(v.controlEffect); const z = (diff + n(v.margin)) / n(v.se); const pNonInf = 1 - (z > 0 ? 0.5 * Math.exp(-z * z / 2) / (0.5 + 0.5 * Math.sqrt(1 - Math.exp(-z * z * 2 / Math.PI))) : 1 - 0.5 * Math.exp(-z * z / 2) / (0.5 + 0.5 * Math.sqrt(1 - Math.exp(-z * z * 2 / Math.PI)))); return { result: z, label: 'Non-inferiority Z', unit: '', steps: [{ label: 'Difference (T-C)', value: `${diff.toFixed(4)}` }, { label: 'Z statistic', value: `${z.toFixed(4)}` }, { label: 'Conclusion', value: z > 1.645 ? 'Non-inferior (p<0.05)' : 'Not established' }] } },
  description: 'Non-inferiority tests whether a new treatment is not unacceptably worse than an active control by more than a pre-specified margin δ.',
  formula: 'H₀: T - C ≤ -δ, Z = (T-C + δ) / SE(T-C)',
  interpretation: 'If the lower 95% CI of the difference exceeds -δ, non-inferiority is concluded. Margin δ should be smaller than the established effect of the control.'
}

export default calcDef

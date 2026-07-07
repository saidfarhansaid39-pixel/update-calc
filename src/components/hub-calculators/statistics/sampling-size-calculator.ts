import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ margin: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 1 }, '0-1'), confidence: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 100 }, '0-100'), proportion: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 1 }, '0-1') }),
  fields: [{ name: 'margin', label: 'Margin of Error', type: 'number', min: 0.001, max: 0.499, step: '0.01' }, { name: 'confidence', label: 'Confidence Level (%)', type: 'number', min: 50, max: 99.9, step: '1' }, { name: 'proportion', label: 'Expected Proportion', type: 'number', min: 0.01, max: 0.99, step: '0.05' }],
  compute: (v) => { const zMap: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576, 99.9: 3.291 }; const z = zMap[Math.round(n(v.confidence))] || 1.96; const p = n(v.proportion); const e = n(v.margin); const nSize = Math.ceil((z * z * p * (1 - p)) / (e * e)); return { result: nSize, label: 'Required Sample Size', unit: '', steps: [{ label: 'z-score', value: `${z}` }, { label: 'Margin of error', value: `${e}` }, { label: 'Sample size', value: `${nSize}` }] } },
  description: 'Determine the minimum sample size needed for a survey or experiment given margin of error and confidence level.',
  formula: 'n = (z² × p × (1-p)) / E²',
  interpretation: 'Larger samples give smaller margins of error. n = 385 gives ±5% margin at 95% confidence for p = 0.5.'
}

export default calcDef

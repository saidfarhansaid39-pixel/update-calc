import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ margin: z.string().min(1).refine(v => { const m = parseFloat(v); return m > 0 && m < 1 }, '0-1'), proportion: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'margin', label: 'Margin of Error', type: 'number', min: 0.001, max: 0.499, step: '0.01' }, { name: 'proportion', label: 'Expected Proportion (p)', type: 'number', min: 0.01, max: 0.99, step: '0.05' }, { name: 'alpha', label: 'Alpha (α)', type: 'number', min: 0.001, max: 0.1, step: '0.005' }],
  compute: (v) => { const zMap: Record<number, number> = { 0.1: 1.645, 0.05: 1.96, 0.01: 2.576 }; const alpha = n(v.alpha); const z = zMap[Math.round(alpha * 100) / 100] || 1.96; const p = n(v.proportion); const e = n(v.margin); const nSize = Math.ceil((z * z * p * (1 - p)) / (e * e)); return { result: nSize, label: 'Required Sample Size', unit: '', steps: [{ label: 'z-score', value: `${z}` }, { label: 'p(1-p)', value: `${(p * (1 - p)).toFixed(4)}` }, { label: 'Margin', value: `${e}` }, { label: 'n', value: `${nSize}` }] } },
  description: 'Sample size calculation for estimating a population proportion with specified precision and confidence level.',
  formula: 'n = (z² × p × (1-p)) / E²',
  interpretation: 'Use p = 0.5 for maximum sample size (most conservative). Smaller margins or higher confidence increase n.'
}

export default calcDef

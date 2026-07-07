import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ margin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sd: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'margin', label: 'Margin of Error (d)', type: 'number', min: 0.001, step: '0.01' }, { name: 'sd', label: 'Std Dev (σ)', type: 'number', min: 0.001, step: 'any' }, { name: 'alpha', label: 'Alpha (α)', type: 'number', min: 0.001, max: 0.1, step: '0.005' }],
  compute: (v) => { const zMap: Record<number, number> = { 0.1: 1.645, 0.05: 1.96, 0.01: 2.576 }; const alpha = n(v.alpha); const z = zMap[Math.round(alpha * 100) / 100] || 1.96; const d = n(v.margin); const sigma = n(v.sd); const nSize = Math.ceil((z * z * sigma * sigma) / (d * d)); return { result: nSize, label: 'Required Sample Size', unit: '', steps: [{ label: 'z-score', value: `${z}` }, { label: 'Variance', value: `${(sigma * sigma).toFixed(4)}` }, { label: 'Margin', value: `${d}` }, { label: 'n', value: `${nSize}` }] } },
  description: 'Sample size calculation for estimating a population mean with specified precision and confidence level.',
  formula: 'n = (z² × σ²) / d²',
  interpretation: 'Larger margins or smaller variances reduce required sample size. n increases with higher confidence (tighter α).'
}

export default calcDef

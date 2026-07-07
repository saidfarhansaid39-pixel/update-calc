import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ accuracyOOB: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a <= 100 }, '0-100'), nTrees: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 10 && n <= 10000 }, '10-10000') }),
  fields: [{ name: 'accuracyOOB', label: 'OOB Accuracy (%)', type: 'number', min: 0.1, max: 100, step: '1' }, { name: 'nTrees', label: 'Number of Trees', type: 'number', min: 10, max: 10000, step: '10' }],
  compute: (v) => { const oob = n(v.accuracyOOB) / 100; const trees = Math.round(n(v.nTrees)); const error = 1 - oob; const se = Math.sqrt(oob * error / trees); return { result: oob, label: 'OOB Accuracy', unit: '', steps: [{ label: 'Trees', value: `${trees}` }, { label: 'OOB accuracy', value: `${(oob * 100).toFixed(1)}%` }, { label: 'OOB error', value: `${(error * 100).toFixed(1)}%` }, { label: 'Approx SE', value: `${se.toExponential(4)}` }] } },
  description: 'Random Forest builds an ensemble of decision trees on bootstrapped samples, aggregating predictions by majority vote.',
  formula: 'ŷ = majority vote(ŷ₁, ..., ŷ_B) for classification, mean for regression',
  interpretation: 'Out-of-bag (OOB) error estimates generalization error without a separate validation set. Feature importance is measurable.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trainLabels: z.string().min(1, 'Required'), testDistances: z.string().min(1, 'Required'), k: z.string().min(1).refine(v => { const k = parseInt(v); return k >= 1 && k <= 20 }, '1-20') }),
  fields: [{ name: 'trainLabels', label: 'Training Labels (0/1, comma sep)', type: 'number', step: 'any' }, { name: 'testDistances', label: 'Distances to test point (comma sep)', type: 'number', step: 'any' }, { name: 'k', label: 'K neighbors', type: 'number', min: 1, max: 20, step: '1' }],
  compute: (v) => { const labels = parseList(v.trainLabels); const dists = parseList(v.testDistances); const k = Math.round(n(v.k)); if (labels.length !== dists.length || labels.length < k) return { result: `Need ≥${k} labeled points`, label: '', unit: '', steps: [] }; const paired = labels.map((l, i) => ({ label: l, dist: dists[i] })).sort((a, b) => a.dist - b.dist); const kNearest = paired.slice(0, k); const nPos = kNearest.filter(p => p.label === 1).length; const pred = nPos > k / 2 ? 1 : 0; return { result: pred, label: 'Predicted Class', unit: '', steps: [{ label: 'k neighbors', value: `${k}` }, { label: 'Neighbors (dist,label)', value: kNearest.map(p => `(${p.dist.toFixed(2)},${p.label})`).join(', ') }, { label: 'Votes class 1', value: `${nPos}/${k}` }, { label: 'Prediction', value: `${pred}` }] } },
  description: 'K-Nearest Neighbors classifies a point based on the majority class among its k closest training examples.',
  formula: 'ŷ = majority class of k-nearest neighbors by distance metric',
  interpretation: 'Small k: low bias, high variance. Large k: high bias, low variance. Scale features before using KNN.'
}

export default calcDef

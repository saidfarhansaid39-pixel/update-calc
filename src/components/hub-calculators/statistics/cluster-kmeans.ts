import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), k: z.string().min(1).refine(v => { const k = parseInt(v); return k >= 2 && k <= 10 }, '2-10') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'k', label: 'Number of Clusters (k)', type: 'number', min: 2, max: 10, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const k = Math.round(n(v.k)); if (nums.length < k * 2) return { result: `Need ≥${k * 2} values`, label: '', unit: '', steps: [] }; const centroids = nums.slice(0, k); const assign = nums.map(x => { let minDist = Infinity; let best = 0; for (let j = 0; j < k; j++) { const d = Math.abs(x - centroids[j]); if (d < minDist) { minDist = d; best = j } }; return best }); const sums = Array(k).fill(0); const counts = Array(k).fill(0); assign.forEach((c, i) => { sums[c] += nums[i]; counts[c]++ }); const newCentroids = sums.map((s, i) => counts[i] > 0 ? s / counts[i] : 0); const wcss = nums.reduce((acc, x, i) => acc + (x - newCentroids[assign[i]]) ** 2, 0); return { result: `WCSS:${wcss.toFixed(4)}`, label: 'K-Means (1 iteration)', unit: '', steps: [{ label: 'k', value: `${k}` }, { label: 'Observations', value: `${nums.length}` }, { label: 'Centroids', value: newCentroids.map(c => c.toFixed(2)).join(', ') }, { label: 'WCSS', value: `${wcss.toFixed(4)}` }] } },
  description: 'K-means clustering partitions data into k clusters by minimizing within-cluster sum of squares (WCSS).',
  formula: 'WCSS = Σ Σ ||x - μᵢ||², minimize over cluster assignments and centroids',
  interpretation: 'K is chosen via the elbow method (WCSS vs k) or silhouette score. Converges to a local optimum.'
}

export default calcDef

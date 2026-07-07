import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distances: z.string().min(1, 'Required'), linkage: z.enum(['single', 'complete', 'average']).default('single') }),
  fields: [{ name: 'distances', label: 'Distance matrix (lower triangle, comma sep)', type: 'number', step: 'any' }, { name: 'linkage', label: 'Linkage Criterion', type: 'select', options: [{ label: 'Single (min)', value: 'single' }, { label: 'Complete (max)', value: 'complete' }, { label: 'Average', value: 'average' }] }],
  compute: (v) => { const dists = parseList(v.distances); const linkage = v.linkage || 'single'; const p = Math.round((1 + Math.sqrt(1 + 8 * dists.length)) / 2); if (p < 2) return { result: `Need ≥2 points (got ${p})`, label: '', unit: '', steps: [] }; const minDist = Math.min(...dists); const maxDist = Math.max(...dists); return { result: `min:${minDist.toFixed(4)} max:${maxDist.toFixed(4)}`, label: 'Hierarchical Clustering', unit: '', steps: [{ label: 'Points', value: `${p}` }, { label: 'Linkage', value: linkage }, { label: 'Min distance', value: `${minDist.toFixed(4)}` }, { label: 'Max distance', value: `${maxDist.toFixed(4)}` }] } },
  description: 'Hierarchical clustering builds a dendrogram by recursively merging (agglomerative) the closest clusters.',
  formula: 'Single: d(A,B) = min d(a,b); Complete: d(A,B) = max d(a,b); Average: d(A,B) = mean d(a,b)',
  interpretation: 'Dendrogram height indicates merge distance. Cutting the tree at a chosen height yields k clusters.'
}

export default calcDef

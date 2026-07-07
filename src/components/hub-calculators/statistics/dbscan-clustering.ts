import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distances: z.string().min(1, 'Required'), eps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), minPts: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1') }),
  fields: [{ name: 'distances', label: 'Distances to nearest neighbors (comma sep)', type: 'number', step: 'any' }, { name: 'eps', label: 'Epsilon (ε) radius', type: 'number', min: 0.001, step: 'any' }, { name: 'minPts', label: 'Min Points', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const dists = parseList(v.distances); const eps = n(v.eps); const minPts = Math.round(n(v.minPts)); if (dists.length < 1) return { result: 'Enter distances', label: '', unit: '', steps: [] }; const nCore = dists.filter(d => d <= eps).length; const nBorder = dists.filter(d => d > eps && d <= eps * 2).length; const nNoise = dists.length - nCore - nBorder; return { result: `Core:${nCore} Border:${nBorder} Noise:${nNoise}`, label: 'DBSCAN Classification', unit: '', steps: [{ label: 'ε', value: `${eps}` }, { label: 'MinPts', value: `${minPts}` }, { label: 'Core points', value: `${nCore}` }, { label: 'Border points', value: `${nBorder}` }, { label: 'Noise points', value: `${nNoise}` }] } },
  description: 'DBSCAN clusters points based on density: core points (dense), border points, and noise (sparse).',
  formula: 'Core: neighbors(ε) ≥ minPts; Border: reachable from core; Noise: not core or border',
  interpretation: 'DBSCAN finds arbitrary-shaped clusters and identifies outliers. Sensitive to ε and minPts parameters.'
}

export default calcDef

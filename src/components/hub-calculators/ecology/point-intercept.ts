import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hits: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), total: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [
    { name: 'hits', label: 'Points hitting target species', type: 'number', min: 0, step: '1' },
    { name: 'total', label: 'Total points sampled', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const hits = parseInt(v.hits); const total = parseInt(v.total); const cover = total>0?hits/total*100:0; return { result: cover, label: 'Percent Cover', unit: '%', steps: [{ label: 'Hits', value: `${hits}` }, { label: 'Total points', value: `${total}` }, { label: 'Cover = hits/total × 100', value: `${cover.toFixed(1)}%` }] } },
  description: 'Point-intercept method estimates species cover by recording the proportion of sampling points where the target species is encountered.',
  formula: 'Cover (%) = (Hits / Total points) × 100',
  interpretation: 'Point-intercept is efficient for estimating cover in grasslands, shrublands, and intertidal zones. More points = greater precision.'
}

export default calcDef

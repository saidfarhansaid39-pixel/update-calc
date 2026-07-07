import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ interceptLen: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), totalLen: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'interceptLen', label: 'Total intercepted length for species (m)', type: 'number', min: 0, step: '0.1' },
    { name: 'totalLen', label: 'Total transect length (m)', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => { const inter = parseFloat(v.interceptLen); const total = parseFloat(v.totalLen); const cover = total>0?inter/total*100:0; return { result: cover, label: 'Line Intercept Cover', unit: '%', steps: [{ label: 'Intercepted length', value: `${inter} m` }, { label: 'Total transect length', value: `${total} m` }, { label: 'Cover = intercept/total × 100', value: `${cover.toFixed(1)}%` }] } },
  description: 'Line-intercept method measures species cover as the proportion of total transect length intersected by the target species.',
  formula: 'Cover (%) = (Intercepted length / Total length) × 100',
  interpretation: 'Line intercept is efficient for estimating plant cover in dense vegetation. Multiple transects improve precision. Bias when plants are clumped.'
}

export default calcDef

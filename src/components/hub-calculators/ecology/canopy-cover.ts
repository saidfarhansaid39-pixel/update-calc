import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pointsCovered: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), totalPoints: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [
    { name: 'pointsCovered', label: 'Points with canopy overhead', type: 'number', min: 0, step: '1' },
    { name: 'totalPoints', label: 'Total sampling points', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const covered = parseInt(v.pointsCovered); const total = parseInt(v.totalPoints); const pct = total>0?covered/total*100:0; return { result: pct, label: 'Canopy Cover', unit: '%', steps: [{ label: 'Canopy points', value: `${covered}` }, { label: 'Total points', value: `${total}` }, { label: 'Cover = covered/total × 100', value: `${pct.toFixed(1)}%` }, { label: 'Interpretation', value: pct>70?'Closed canopy':pct>30?'Moderate canopy':'Open canopy' }] } },
  description: 'Canopy cover is the proportion of ground area covered by the vertical projection of tree crowns, measured using densiometers or point sampling.',
  formula: 'Canopy cover (%) = (Points with canopy / Total points) × 100',
  interpretation: '>70% = closed canopy forest, 30-70% = moderate, <30% = open canopy. Affects understory light, temperature, and moisture conditions.'
}

export default calcDef

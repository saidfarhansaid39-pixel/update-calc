import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ workSec: z.string().min(1).refine(v => parseFloat(v) > 0), restSec: z.string().min(1).refine(v => parseFloat(v) > 0), rounds: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 1 && n <= 20 }, '1-20') }),
  fields: [
    { name: 'workSec', label: 'Work Duration', type: 'number', unit: 's', min: 10, step: '5' },
    { name: 'restSec', label: 'Rest Duration', type: 'number', unit: 's', min: 5, step: '5' },
    { name: 'rounds', label: 'Rounds', type: 'number', min: 1, max: 20, step: '1' },
  ],
  compute: (v) => {
    const totalSec = (v.workSec + v.restSec) * v.rounds; const totalMin = totalSec / 60
    const intensity = v.workSec / (v.workSec + v.restSec) * 100
    return { result: totalSec, label: 'Total HIIT Session', unit: 's', steps: [
      { label: 'Work interval', value: v.workSec+' s' }, { label: 'Rest interval', value: v.restSec+' s' },
      { label: 'Rounds', value: ''+v.rounds }, { label: 'Work density', value: intensity.toFixed(0)+'% work time' },
      { label: 'Total session', value: totalSec+' s ('+totalMin.toFixed(1)+' min)' },
    ]}
  }, description: 'Design HIIT (High-Intensity Interval Training) sessions. HIIT alternates maximal effort work periods with recovery intervals.', formula: 'Total time = (work + rest) × rounds', interpretation: 'HIIT improves VO2max and insulin sensitivity more efficiently than steady-state cardio in less total time.'
}

export default calcDef

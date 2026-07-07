import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ workSec: z.string().min(1).refine(v => parseFloat(v) > 0), minutes: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 1 && n <= 30 }, '1-30') }),
  fields: [
    { name: 'workSec', label: 'Work Duration Per Minute', type: 'number', unit: 's', min: 5, max: 50, step: '5' },
    { name: 'minutes', label: 'Total Minutes', type: 'number', min: 1, max: 30, step: '1' },
  ],
  compute: (v) => {
    const restSec = 60 - v.workSec; const totalWork = v.workSec * v.minutes; const totalRest = restSec * v.minutes
    return { result: totalWork/60, label: 'Total Work Time', unit: 'min', steps: [
      { label: 'Work per minute', value: v.workSec+' s' }, { label: 'Rest per minute', value: restSec+' s' },
      { label: 'Total minutes', value: ''+v.minutes }, { label: 'Work:Rest ratio', value: v.workSec+':'+restSec },
      { label: 'Total work', value: totalWork+' s ('+(totalWork/60).toFixed(1)+' min)' },
    ]}
  }, description: 'Plan EMOM (Every Minute On the Minute) workouts. Complete prescribed work in <60s, rest the remainder.', formula: 'Rest = 60s - work time; Work:Rest ratio = work:(60-work)', interpretation: 'EMOM workouts build work capacity and pacing discipline. Adjust work duration to maintain quality across all rounds.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ workSec: z.string().optional().refine(v => !v || parseFloat(v) > 0), restSec: z.string().optional().refine(v => !v || parseFloat(v) > 0), rounds: z.string().optional().refine(v => !v || parseFloat(v) > 0) }),
  fields: [
    { name: 'workSec', label: 'Work Duration (default 20s)', type: 'number', unit: 's', min: 10, max: 60, step: '5' },
    { name: 'restSec', label: 'Rest Duration (default 10s)', type: 'number', unit: 's', min: 5, max: 30, step: '5' },
    { name: 'rounds', label: 'Rounds (default 8)', type: 'number', min: 1, max: 20, step: '1' },
  ],
  compute: (v) => {
    const work = v.workSec || 20; const rest = v.restSec || 10; const rds = v.rounds || 8
    const totalSec = (work + rest) * rds; const totalMin = totalSec / 60
    return { result: totalSec, label: 'Total Session Duration', unit: 's', steps: [
      { label: 'Work interval', value: work+' s' }, { label: 'Rest interval', value: rest+' s' },
      { label: 'Rounds', value: ''+rds }, { label: 'Work:Rest', value: work+':'+rest },
      { label: 'Total time', value: totalSec+' s ('+totalMin.toFixed(1)+' min)' },
    ]}
  }, description: 'Tabata protocol timer: 20 seconds work, 10 seconds rest, repeated for 8 rounds (4 minutes total).', formula: 'Standard Tabata: 20s work / 10s rest × 8 rounds = 4 min', interpretation: 'Tabata training at maximal intensity improves both aerobic and anaerobic systems. Classic Tabata uses 170% VO2max intensity.'
}

export default calcDef

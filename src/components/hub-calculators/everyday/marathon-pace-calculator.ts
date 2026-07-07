import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), minutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seconds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distUnit: z.enum(['mi', 'km']) }),
  fields: [
    { name: 'hours', label: 'Hours', type: 'number', min: 0, max: 24, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'distance', label: 'Distance', type: 'number', min: 0.1, step: '1' },
    { name: 'distUnit', label: 'Distance Unit', type: 'select', options: [{ label: 'Miles', value: 'mi' }, { label: 'Kilometers', value: 'km' }] },
  ],
  compute: (v) => { const totalSec = v.hours * 3600 + v.minutes * 60 + v.seconds; const paceSecPerUnit = totalSec / v.distance; const paceMin = Math.floor(paceSecPerUnit / 60); const paceSec = Math.round(paceSecPerUnit % 60); const label = v.distUnit === 'mi' ? 'min/mile' : 'min/km'; const marathonDist = v.distUnit === 'mi' ? 26.21875 : 42.195; const halfDist = marathonDist / 2; const totalTimeSec = totalSec; const marathonTimeSec = paceSecPerUnit * marathonDist; const halfTimeSec = paceSecPerUnit * halfDist; const hour = Math.floor(marathonTimeSec / 3600); const min = Math.floor((marathonTimeSec % 3600) / 60); const sec = Math.floor(marathonTimeSec % 60); return { result: paceSecPerUnit, label: 'Pace', unit: label, steps: [{ label: 'Total Time', value: `${v.hours}h ${v.minutes}m ${v.seconds}s` }, { label: 'Pace', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} ${label}` }, { label: 'Half Marathon Time', value: `${Math.floor(halfTimeSec / 3600)}h ${Math.floor((halfTimeSec % 3600) / 60)}m ${Math.floor(halfTimeSec % 60)}s` }, { label: 'Marathon Time', value: `${hour}h ${min}m ${sec}s` }] } },
  description: 'Calculate running pace from total time and distance, then project half marathon and full marathon finish times.',
  formula: 'Pace = Total Time (sec) / Distance | Marathon Time = Pace × 26.219 (mi) or 42.195 (km)',
  interpretation: 'Elite marathoners run 4:30-5:30/mile (2:48-3:25/km). Recreational: 8-12 min/mile. Negative splitting (running second half faster) is recommended for best performance.'
}

export default calcDef

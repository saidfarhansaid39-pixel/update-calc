import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), minutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seconds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), distanceUnit: z.string().min(1) }),
  fields: [
    { name: 'hours', label: 'Target Hours', type: 'number', min: 0, max: 24, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '5' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '10' },
    { name: 'distanceUnit', label: 'Distance', type: 'select', options: [{ label: 'Marathon (26.22 mi)', value: 'marathonMi' }, { label: 'Half Marathon (13.11 mi)', value: 'halfMi' }, { label: '10K (6.214 mi)', value: '10kMi' }, { label: '5K (3.107 mi)', value: '5kMi' }] },
  ],
  compute: (v) => {
    const raceDistances: Record<string, number> = { marathonMi: 26.22, halfMi: 13.11, '10kMi': 6.214, '5kMi': 3.107 }
    const dist = raceDistances[v.distanceUnit]
    const totalSeconds = v.hours * 3600 + v.minutes * 60 + v.seconds
    const pacePerMileSeconds = totalSeconds / dist
    const paceMin = Math.floor(pacePerMileSeconds / 60)
    const paceSec = Math.round(pacePerMileSeconds % 60)
    return { result: pacePerMileSeconds, label: 'Pace', unit: '/mi', steps: [{ label: 'Total Time', value: `${v.hours}h ${v.minutes}m ${v.seconds}s` }, { label: 'Distance', value: `${dist} mi` }, { label: 'Pace per Mile', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} /mi` }] }
  },
  description: 'Calculate required running pace per mile for marathon, half marathon, 10K, or 5K based on target finish time.',
  formula: 'Pace (min/mi) = TotalSeconds / Distance',
  interpretation: 'Sub-4 hour marathon: 9:09/mi. Sub-3:30: 8:00/mi. Sub-3:00: 6:50/mi. Half marathon at 8:00/mi = 1:44:52. Negative splits (faster second half) are optimal.'
}

export default calcDef

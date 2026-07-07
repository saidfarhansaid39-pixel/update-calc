import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    marathonGoalMin: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 2 && val <= 8 }, '2-8 hours'),
    longRunKm: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'marathonGoalMin', label: 'Marathon Goal Time', type: 'number', unit: 'hours', min: 2, max: 8, step: '0.25' },
    { name: 'longRunKm', label: 'Long Run Distance', type: 'number', unit: 'km', min: 5, step: '1' },
  ],
  compute: (v) => {
    const marathonPaceMin = v.marathonGoalMin * 60 / 42.195
    const longRunPaceMin = marathonPaceMin * 1.15
    const lrMin = Math.floor(longRunPaceMin)
    const lrSec = Math.round((longRunPaceMin - lrMin) * 60)
    const estDuration = longRunPaceMin * v.longRunKm
    return {
      result: longRunPaceMin, label: 'Long Run Pace', unit: 'min/km',
      steps: [
        { label: 'Marathon goal time', value: `${v.marathonGoalMin} hrs` },
        { label: 'Marathon pace', value: `${Math.floor(marathonPaceMin)}:${Math.round((marathonPaceMin % 1) * 60).toString().padStart(2, '0')} /km` },
        { label: 'Long run pace (+15%)', value: `${lrMin}:${lrSec.toString().padStart(2, '0')} /km` },
        { label: 'Run distance', value: `${v.longRunKm} km` },
        { label: 'Estimated duration', value: `${Math.floor(estDuration / 60)}h ${(estDuration % 60).toFixed(0)}m` },
      ]
}
  },
  description: 'Calculate your ideal long run pace based on marathon goal time. Long runs should be 45-90 seconds per km slower than marathon pace to build endurance safely.'
}

export default calcDef

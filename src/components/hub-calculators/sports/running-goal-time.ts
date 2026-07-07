import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    paceMin: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 0 && val <= 59 }, '0-59'),
    paceSec: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 0 && val <= 59 }, '0-59')
}),
  fields: [
    { name: 'distance', label: 'Race Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'paceMin', label: 'Pace Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'paceSec', label: 'Pace Seconds', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const paceTotalMin = v.paceMin + v.paceSec / 60
    const totalMin = v.distance * paceTotalMin
    const hours = Math.floor(totalMin / 60)
    const mins = Math.round(totalMin % 60)
    return {
      result: totalMin, label: 'Estimated Finish Time', unit: 'min',
      steps: [
        { label: 'Distance', value: `${v.distance} km` },
        { label: 'Target pace', value: `${v.paceMin}:${v.paceSec.toString().padStart(2, '0')} /km` },
        { label: 'Total time', value: `${hours}h ${mins}m (${totalMin.toFixed(1)} min)` },
        { label: 'Per 5 km split', value: `${(paceTotalMin * 5).toFixed(1)} min` },
      ]
}
  },
  description: 'Calculate your estimated race finish time from distance and target pace per kilometer. Set realistic race goals based on your current fitness level.'
}

export default calcDef

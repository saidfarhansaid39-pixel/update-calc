import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, 'Must be > 0'), time: z.string().min(1).refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 50, step: '50' },
    { name: 'time', label: 'Time', type: 'number', unit: 'min', min: 0.5, step: '0.5' },
  ],
  compute: (v) => {
    const pace = v.time / (v.distance / 100); const speed = v.distance / v.time / 60 * 1000
    const min = Math.floor(pace); const sec = Math.round((pace - min) * 60)
    return { result: speed, label: 'Average Speed', unit: 'm/s', steps: [{ label: 'Distance', value: v.distance + ' m' }, { label: 'Time', value: v.time + ' min' }, { label: 'Pace', value: min + ':' + sec.toString().padStart(2, '0') + ' /100m' }] }
  },
  description: 'Assess swimming fitness based on distance and time. Tracks pace improvement and endurance gains over time.'
}

export default calcDef

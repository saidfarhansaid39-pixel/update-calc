import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0), hours: z.string().min(1).refine(v => parseFloat(v) >= 0), minutes: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }) }),
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalH = v.hours + v.minutes/60; const speed = totalH > 0 ? v.distance / totalH : 0
    return { result: speed, label: 'Average Speed', unit: 'km/h', steps: [
      { label: 'Distance', value: v.distance+' km' }, { label: 'Time', value: v.hours+'h '+v.minutes+'m' },
      { label: 'Speed', value: speed.toFixed(1)+' km/h' },
    ]}
  }, description: 'Calculate cycling average speed from distance and ride time. Basic measure of cycling performance.', formula: 'Speed = distance / time', interpretation: 'Higher average speed indicates better cycling fitness and efficiency.'
}

export default calcDef

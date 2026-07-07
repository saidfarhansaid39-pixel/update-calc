import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ swpDistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), swpUnit: z.string().min(1), swpHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), swpMinutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), swpSeconds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'swpDistance', label: 'Swim Distance', type: 'number', min: 25, step: '25' },
    { name: 'swpUnit', label: 'Unit', type: 'select', options: [{ label: 'Meters', value: 'm' }, { label: 'Yards', value: 'yd' }, { label: 'Miles', value: 'mi' }, { label: 'Kilometers', value: 'km' }] },
    { name: 'swpHours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'swpMinutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'swpSeconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '5' },
  ],
  compute: (v) => {
    const convertToMeters: Record<string, number> = { m: 1, yd: 0.9144, mi: 1609.34, km: 1000 }
    const distMeters = v.swpDistance * (convertToMeters[v.swpUnit] || 1)
    const totalSeconds = v.swpHours * 3600 + v.swpMinutes * 60 + v.swpSeconds
    const pacePer100m = totalSeconds / (distMeters / 100)
    const paceMin = Math.floor(pacePer100m / 60)
    const paceSec = Math.round(pacePer100m % 60)
    const speedKmh = (distMeters / 1000) / (totalSeconds / 3600)
    return { result: pacePer100m, label: 'Pace per 100m', unit: 'sec', steps: [{ label: 'Distance', value: v.swpDistance + ' ' + v.swpUnit + ' (' + distMeters.toFixed(0) + ' m)' }, { label: 'Total Time', value: v.swpHours + 'h ' + v.swpMinutes + 'm ' + v.swpSeconds + 's' }, { label: 'Pace/100m', value: paceMin + ':' + paceSec.toString().padStart(2, '0') + ' min/100m' }, { label: 'Speed', value: speedKmh.toFixed(2) + ' km/h' }] }
  },
  description: 'Calculate swim pace per 100 meters/yards based on distance and total time. Essential for pool and open water training.',
  formula: 'Pace/100m = TotalSeconds / (DistanceMeters / 100) | Common pools: 25m (short), 50m (Olympic), 25yd (US short)',
  interpretation: 'Recreational: 2:00-2:30/100m. Intermediate: 1:30-2:00/100m. Advanced: 1:15-1:30/100m. Elite: <1:00/100m. Open water pace is typically 5-10% slower than pool pace.'
}

export default calcDef

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
  defaults: { swpDistance: '100', swpUnit: 'm', swpHours: '0', swpMinutes: '2', swpSeconds: '0' },
  presets: [
    { label: 'Sprint 50m Freestyle', values: { swpDistance: '50', swpUnit: 'm', swpHours: '0', swpMinutes: '0', swpSeconds: '35' } },
    { label: '200m Individual Medley', values: { swpDistance: '200', swpUnit: 'm', swpHours: '0', swpMinutes: '2', swpSeconds: '30' } },
    { label: '1-Mile Open Water', values: { swpDistance: '1', swpUnit: 'mi', swpHours: '0', swpMinutes: '30', swpSeconds: '0' } },
    { label: '1km Pool Session', values: { swpDistance: '1000', swpUnit: 'm', swpHours: '0', swpMinutes: '20', swpSeconds: '0' } },
  ],
  compute: (v) => {
    const convertToMeters: Record<string, number> = { m: 1, yd: 0.9144, mi: 1609.34, km: 1000 }
    const distMeters = v.swpDistance * (convertToMeters[v.swpUnit] || 1)
    const totalSeconds = v.swpHours * 3600 + v.swpMinutes * 60 + v.swpSeconds
    const pacePer100m = totalSeconds / (distMeters / 100)
    const paceMin = Math.floor(pacePer100m / 60)
    const paceSec = Math.round(pacePer100m % 60)
    const speedKmh = (distMeters / 1000) / (totalSeconds / 3600)
    return { result: pacePer100m, label: 'Pace per 100m', unit: 'sec', steps: [{ label: 'Distance', value: v.swpDistance + ' ' + v.swpUnit + ' (' + distMeters.toFixed(0) + ' m)' }, { label: 'Total Time', value: v.swpHours + 'h ' + v.swpMinutes + 'm ' + v.swpSeconds + 's' }, { label: 'Pace/100m', value: paceMin + ':' + paceSec.toString().padStart(2, '0') + ' min/100m' }, { label: 'Speed', value: speedKmh.toFixed(2) + ' km/h' }] ,
    extras: [
      { label: 'Pace Categories', value: 'Elite: <1:00/100m. Advanced: 1:15-1:30. Intermediate: 1:30-2:00. Recreational: 2:00-2:30. Novice: >2:30' },
      { label: 'Pool vs Open Water', value: 'Open water pace is typically 5-10% slower than pool pace due to navigation, waves, and wetsuit factors' },
      { label: 'Pacing Strategy', value: 'Negative splitting (second half faster than first) improves overall time. Aim for even pace across all 100m splits' },
      { label: 'Drafting Benefit', value: 'Swimming directly behind another swimmer reduces drag by 20-30%, saving 2-5 sec/100m' },
      { label: 'Wetsuit Effect', value: 'In triathlon-legal wetsuits, pace improves 3-10 sec/100m due to buoyancy and reduced drag' },
      { label: 'Pool Length Standards', value: 'Olympic pool: 50m. US short course: 25yd (22.86m). UK/Europe short course: 25m. Count lengths accurately' },
      { label: 'Training Zones', value: 'Use pace per 100m to set training zones: CSS (Critical Swim Speed) = best 400m pace, holds for 1,500m+' },
    ]}
  },
  description: 'Calculate swim pace per 100m and speed from distance and total time. Essential for pool training, open water racing, and triathlon preparation.',
  formula: 'Pace/100m = TotalSeconds ÷ (DistanceMeters ÷ 100). Speed(km/h) = (DistanceMeters ÷ 1000) ÷ (TotalSeconds ÷ 3600). Distance conversions: 1yd = 0.9144m, 1mi = 1,609.34m, 1km = 1,000m.',
  interpretation: 'Recreational swimmers: 2:00-2:30/100m. Intermediate: 1:30-2:00/100m. Advanced: 1:15-1:30/100m. Elite: <1:00/100m. A 2:00/100m pace equals 3 km/h speed. Use CSS (Critical Swim Speed) testing — swim a best-effort 400m and 200m, the difference determines your lactate threshold pace. Most triathlon open water swims average 1:45-2:15/100m for age-group athletes.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    courtDist: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    timeSec: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'courtDist', label: 'Court Diagonal Distance', type: 'number', unit: 'm', min: 10, max: 30, step: '0.5' },
    { name: 'timeSec', label: 'Ball Travel Time', type: 'number', unit: 's', min: 0.1, step: '0.01' },
  ],
  compute: (v) => {
    const speedMs = v.courtDist / v.timeSec
    const speedKmh = speedMs * 3.6
    const speedMph = speedKmh * 0.6214
    return {
      result: speedKmh, label: 'Serve Speed', unit: 'km/h',
      steps: [
        { label: 'Court diagonal', value: `${v.courtDist} m` },
        { label: 'Ball flight time', value: `${v.timeSec} s` },
        { label: 'Speed (m/s)', value: `${speedMs.toFixed(1)} m/s` },
        { label: 'Speed (km/h)', value: `${speedKmh.toFixed(1)} km/h` },
        { label: 'Speed (mph)', value: `${speedMph.toFixed(1)} mph` },
        { label: 'Comparison', value: speedKmh > 200 ? 'ATP-level serve' : speedKmh > 160 ? 'Competitive serve' : speedKmh > 120 ? 'Club level' : 'Developing serve' },
      ]
}
  },
  description: 'Calculate tennis serve speed by measuring ball travel time across the court diagonal (standard ~23.8 m). Professional serves typically exceed 200 km/h (125 mph).'
}

export default calcDef

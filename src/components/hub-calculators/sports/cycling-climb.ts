import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    climbDist: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    gainM: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    powerW: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    weightKg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'climbDist', label: 'Climb Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'gainM', label: 'Elevation Gain', type: 'number', unit: 'm', min: 1, step: '10' },
    { name: 'powerW', label: 'Power Output', type: 'number', unit: 'W', min: 50, step: '10' },
    { name: 'weightKg', label: 'Rider + Bike Weight', type: 'number', unit: 'kg', min: 40, step: '1' },
  ],
  compute: (v) => {
    const grade = v.gainM / (v.climbDist * 1000) * 100
    const vam = v.gainM / (v.climbDist / (v.powerW / (v.weightKg * 9.81 * (0.004 + grade / 100))))
    const speedMs = v.powerW / (v.weightKg * 9.81 * (0.004 + grade / 100))
    const speedKmh = speedMs * 3.6
    const timeMin = v.climbDist * 1000 / speedMs / 60
    return {
      result: speedKmh, label: 'Climbing Speed', unit: 'km/h',
      steps: [
        { label: 'Climb distance', value: `${v.climbDist} km` },
        { label: 'Elevation gain', value: `${v.gainM} m` },
        { label: 'Average grade', value: `${grade.toFixed(1)}%` },
        { label: 'Climbing speed', value: `${speedKmh.toFixed(1)} km/h` },
        { label: 'Estimated time', value: `${Math.floor(timeMin / 60)}h ${(timeMin % 60).toFixed(0)}m` },
        { label: 'VAM', value: `${(v.gainM / (timeMin / 60)).toFixed(0)} m/hr` },
      ]
}
  },
  description: 'Calculate climbing speed and time from distance, elevation gain, power output, and system weight. Grade is the steepness percentage—a 10% grade climbs 10 meters per 100 meters forward.'
}

export default calcDef

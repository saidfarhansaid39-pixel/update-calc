import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    riseM: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    runM: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'riseM', label: 'Vertical Rise', type: 'number', unit: 'm', min: 1, step: '1' },
    { name: 'runM', label: 'Horizontal Distance', type: 'number', unit: 'm', min: 1, step: '1' },
  ],
  compute: (v) => {
    const grade = v.riseM / v.runM * 100
    const angle = Math.atan(v.riseM / v.runM) * 180 / Math.PI
    const distSlope = Math.sqrt(v.riseM * v.riseM + v.runM * v.runM)
    return {
      result: grade, label: 'Gradient', unit: '%',
      steps: [
        { label: 'Rise', value: `${v.riseM} m` },
        { label: 'Run', value: `${v.runM} m` },
        { label: 'Grade', value: `${grade.toFixed(1)}%` },
        { label: 'Angle', value: `${angle.toFixed(1)}°` },
        { label: 'Slope distance', value: `${distSlope.toFixed(1)} m` },
        { label: 'Category', value: grade < 3 ? 'Gentle' : grade < 6 ? 'Moderate' : grade < 10 ? 'Steep' : grade < 15 ? 'Very steep' : 'Extreme' },
      ]
}
  },
  description: 'Calculate gradient percentage and angle from rise and horizontal distance. Grade percentage is the ratio of vertical rise to horizontal distance, used in road cycling, hiking, and construction.'
}

export default calcDef

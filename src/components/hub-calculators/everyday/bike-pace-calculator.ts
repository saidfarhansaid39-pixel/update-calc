import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), targetTimeHr: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), targetTimeMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'distance', label: 'Ride Distance (miles)', type: 'number', min: 1, step: '5' },
    { name: 'targetTimeHr', label: 'Target Hours', type: 'number', min: 0, step: '1' },
    { name: 'targetTimeMin', label: 'Target Minutes', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const totalMinutes = v.targetTimeHr * 60 + v.targetTimeMin
    const paceMinPerMile = totalMinutes / v.distance
    const speedMph = v.distance / (totalMinutes / 60)
    return { result: paceMinPerMile, label: 'Average Pace', unit: 'min/mi', steps: [{ label: 'Total Time', value: `${totalMinutes} min` }, { label: 'Pace', value: `${paceMinPerMile.toFixed(1)} min/mi` }, { label: 'Speed', value: `${speedMph.toFixed(1)} mph` }] }
  },
  description: 'Calculate your cycling pace per mile and average speed. Enter distance and target time to find the pace needed to achieve your goal.',
  formula: 'Pace (min/mi) = Total Minutes / Distance | Speed (mph) = Distance / (Hours + Minutes/60)',
  interpretation: 'Leisure: 8-12 mph (5:00-7:30/mi). Fitness: 12-16 mph (3:45-5:00/mi). Racing: 16-20+ mph (<3:45/mi). Wind and elevation add 10-30% to effort.'
}

export default calcDef

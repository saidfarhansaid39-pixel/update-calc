import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    workMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    restMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    intervals: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 1 && val <= 30 }, '1-30')
}),
  fields: [
    { name: 'workMin', label: 'Work Duration', type: 'number', unit: 'min', min: 0.1, step: '0.1' },
    { name: 'restMin', label: 'Rest Duration', type: 'number', unit: 'min', min: 0.1, step: '0.1' },
    { name: 'intervals', label: 'Number of Intervals', type: 'number', min: 1, max: 30, step: '1' },
  ],
  compute: (v) => {
    const totalWork = v.workMin * v.intervals
    const totalRest = v.restMin * (v.intervals - 1)
    const totalSession = totalWork + totalRest
    const workRestRatio = v.restMin > 0 ? (v.workMin / v.restMin).toFixed(1) : '0'
    return {
      result: totalSession, label: 'Total Session Time', unit: 'min',
      steps: [
        { label: 'Work intervals', value: `${v.intervals} × ${v.workMin} min = ${totalWork.toFixed(1)} min` },
        { label: 'Rest periods', value: `${v.intervals - 1} × ${v.restMin} min = ${totalRest.toFixed(1)} min` },
        { label: 'Work:Rest ratio', value: `${workRestRatio}:1` },
        { label: 'Total session', value: `${totalSession.toFixed(1)} min (${Math.floor(totalSession / 60)}h ${(totalSession % 60).toFixed(0)}m)` },
      ]
}
  },
  description: 'Plan interval training sessions by setting work duration, rest duration, and number of intervals. Interval training improves cardiovascular fitness, speed, and endurance.'
}

export default calcDef

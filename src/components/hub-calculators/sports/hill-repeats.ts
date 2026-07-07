import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    repTime: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    grade: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 0 && val <= 30 }, '0-30%'),
    reps: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 1 && val <= 20 }, '1-20'),
    jogDownMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'repTime', label: 'Hill Rep Duration', type: 'number', unit: 'min', min: 0.5, step: '0.5' },
    { name: 'grade', label: 'Hill Grade', type: 'number', unit: '%', min: 0, max: 30, step: '1' },
    { name: 'reps', label: 'Number of Reps', type: 'number', min: 1, max: 20, step: '1' },
    { name: 'jogDownMin', label: 'Jog Down Duration', type: 'number', unit: 'min', min: 0.5, step: '0.5' },
  ],
  compute: (v) => {
    const totalWork = v.repTime * v.reps
    const totalRecovery = v.jogDownMin * (v.reps - 1)
    const totalSession = totalWork + totalRecovery
    const effortMultiplier = 1 + v.grade / 100
    return {
      result: totalSession, label: 'Total Session Time', unit: 'min',
      steps: [
        { label: 'Hill grade', value: `${v.grade}%` },
        { label: 'Reps', value: `${v.reps} × ${v.repTime} min` },
        { label: 'Total work time', value: `${totalWork.toFixed(1)} min` },
        { label: 'Total recovery', value: `${totalRecovery.toFixed(1)} min` },
        { label: 'Effort multiplier', value: `${effortMultiplier.toFixed(2)}× vs flat (hill resistance)` },
      ]
}
  },
  description: 'Plan hill repeat training sessions. Running hills increases leg strength, power, and VO2 max more effectively than flat running at similar effort.'
}

export default calcDef

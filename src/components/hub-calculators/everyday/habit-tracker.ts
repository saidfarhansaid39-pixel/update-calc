import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ habitName: z.string().min(1), habitGoalDays: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), habitDaysDone: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'habitName', label: 'Habit Name', type: 'text' },
    { name: 'habitGoalDays', label: 'Goal (days)', type: 'number', min: 1, step: '7' },
    { name: 'habitDaysDone', label: 'Days Completed', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const progress = Math.min(100, (v.habitDaysDone / v.habitGoalDays) * 100)
    const remaining = Math.max(0, v.habitGoalDays - v.habitDaysDone)
    const streakEst = v.habitDaysDone > 0 ? 'Building' : 'Not started'
    return { result: progress, label: 'Habit Progress', unit: '%', steps: [{ label: 'Habit', value: v.habitName }, { label: 'Goal', value: `${v.habitGoalDays} days` }, { label: 'Completed', value: `${v.habitDaysDone} days` }, { label: 'Remaining', value: `${remaining} days` }, { label: 'Progress', value: `${progress.toFixed(0)}%` }, { label: 'Status', value: streakEst }] }
  },
  description: 'Track your habit formation progress. Research shows it takes 18-254 days to form a new habit with 66 days being the average.',
  formula: 'Progress % = (Days Done / Goal Days) × 100 | Remaining = Goal - Done',
  interpretation: 'Consistency matters more than intensity. Missing one day does not break the habit. The 21-day rule is a myth; most habits take 2-3 months to automate. Start with 2-minute versions of habits.'
}

export default calcDef

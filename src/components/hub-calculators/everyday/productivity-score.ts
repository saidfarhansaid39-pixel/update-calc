import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tasksCompleted: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tasksPlanned: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), focusHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), distractions: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'tasksCompleted', label: 'Tasks Completed', type: 'number', min: 0, step: '1' },
    { name: 'tasksPlanned', label: 'Tasks Planned', type: 'number', min: 1, step: '1' },
    { name: 'focusHours', label: 'Hours of Deep Work', type: 'number', min: 0, step: '0.5' },
    { name: 'distractions', label: 'Interruptions Count', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const completionRate = (v.tasksCompleted / v.tasksPlanned) * 100
    const focusPenalty = Math.min(v.distractions * 2, 40)
    const focusBonus = Math.min(v.focusHours * 5, 30)
    const prodScore = Math.min(100, Math.max(0, completionRate * 0.6 + focusBonus - focusPenalty))
    return { result: prodScore, label: 'Productivity Score', unit: '/100', steps: [{ label: 'Task Completion', value: `${completionRate.toFixed(0)}%` }, { label: 'Deep Work Bonus', value: `+${focusBonus.toFixed(0)}` }, { label: 'Distraction Penalty', value: `-${focusPenalty.toFixed(0)}` }, { label: 'Final Score', value: `${prodScore.toFixed(0)}/100` }] }
  },
  description: 'Calculate a daily productivity score based on task completion, deep work hours, and interruptions.',
  formula: 'Score = Completion%×0.6 + Min(FocusHrs×5,30) - Min(Distractions×2,40)',
  interpretation: 'Score 80+: highly productive day. 60-79: good, room for improvement. Below 60: evaluate time management. Top performers average 4 hrs of deep work daily and limit interruptions via time-blocking.'
}

export default calcDef

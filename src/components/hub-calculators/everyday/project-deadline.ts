import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalTasks: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerTask: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dailyHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), workDaysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bufferPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalTasks', label: 'Total Tasks', type: 'number', min: 1, step: '1' },
    { name: 'hoursPerTask', label: 'Hours per Task', type: 'number', min: 0.25, step: '0.25' },
    { name: 'dailyHours', label: 'Available Hours per Day', type: 'number', min: 0.5, step: '0.5' },
    { name: 'workDaysPerWeek', label: 'Work Days per Week', type: 'number', min: 1, max: 7, step: '1' },
    { name: 'bufferPct', label: 'Buffer (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const totalHours = v.totalTasks * v.hoursPerTask
    const bufferHours = totalHours * (v.bufferPct / 100)
    const adjustedHours = totalHours + bufferHours
    const dailyCapacity = v.dailyHours * v.workDaysPerWeek / 7
    const calendarDays = Math.ceil(adjustedHours / dailyCapacity)
    const weeks = calendarDays / 7
    return { result: calendarDays, label: 'Projected Completion', unit: 'days', steps: [{ label: 'Total Work Hours', value: `${totalHours.toFixed(1)} hrs` }, { label: 'Buffer', value: `+${bufferHours.toFixed(1)} hrs (${v.bufferPct}%)` }, { label: 'Adjusted Hours', value: `${adjustedHours.toFixed(1)} hrs` }, { label: 'Calendar Days Needed', value: `${calendarDays} days (${weeks.toFixed(1)} weeks)` }] }
  },
  description: 'Estimate project completion time based on tasks, hours per task, daily availability, and a buffer for unexpected delays.',
  formula: 'Calendar Days = (Tasks×Hrs/Task × (1+Buf%)) / (DailyHrs×WorkDays/7)',
  interpretation: 'Include 20-30% buffer for knowledge work. Parkinson\'s Law: work expands to fill time. Break large tasks into sub-tasks of 2-4 hrs each. Review and adjust estimates weekly.'
}

export default calcDef

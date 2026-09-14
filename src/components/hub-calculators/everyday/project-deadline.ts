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
  defaults: { totalTasks: '20', hoursPerTask: '3', dailyHours: '6', workDaysPerWeek: '5', bufferPct: '25' },
  presets: [
    { label: 'Website Redesign', values: { totalTasks: '30', hoursPerTask: '4', dailyHours: '6', workDaysPerWeek: '5', bufferPct: '30' } },
    { label: 'Research Paper', values: { totalTasks: '10', hoursPerTask: '5', dailyHours: '4', workDaysPerWeek: '6', bufferPct: '20' } },
    { label: 'Home Renovation Room', values: { totalTasks: '15', hoursPerTask: '3', dailyHours: '5', workDaysPerWeek: '7', bufferPct: '35' } },
    { label: 'Weekend DIY Project', values: { totalTasks: '8', hoursPerTask: '1.5', dailyHours: '4', workDaysPerWeek: '2', bufferPct: '15' } },
  ],
  compute: (v) => {
    const totalHours = v.totalTasks * v.hoursPerTask
    const bufferHours = totalHours * (v.bufferPct / 100)
    const adjustedHours = totalHours + bufferHours
    const avgDailyHrs = v.dailyHours * v.workDaysPerWeek / 7
    const calendarDays = Math.ceil(adjustedHours / avgDailyHrs)
    const weeks = calendarDays / 7
    const finishDate = new Date(Date.now() + calendarDays * 86400000)
    return { result: calendarDays, label: 'Projected Completion', unit: 'days',
      steps: [
        { label: 'Gross Work Hours', value: `${v.totalTasks} tasks × ${v.hoursPerTask} hrs = ${totalHours.toFixed(1)} hrs` },
        { label: 'Buffer Added', value: `${totalHours.toFixed(1)} × ${v.bufferPct}% = +${bufferHours.toFixed(1)} hrs` },
        { label: 'Adjusted Total Hours', value: `${totalHours.toFixed(1)} + ${bufferHours.toFixed(1)} = ${adjustedHours.toFixed(1)} hrs` },
        { label: 'Daily Available Capacity', value: `${v.dailyHours} hrs/day × ${v.workDaysPerWeek}/7 days = ${avgDailyHrs.toFixed(2)} hrs/day avg` },
        { label: 'Calendar Days Needed', value: `${adjustedHours.toFixed(1)} ÷ ${avgDailyHrs.toFixed(2)} = ${(adjustedHours / avgDailyHrs).toFixed(1)} → ${calendarDays} days` },
        { label: 'Weeks Needed', value: `${weeks.toFixed(1)} weeks (${calendarDays} calendar days)` },
        { label: 'Projected End Date', value: finishDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) },
        { label: 'Buffer Recommendation', value: v.bufferPct < 20 ? 'Consider increasing buffer to 20-30% for knowledge work' : v.bufferPct > 50 ? 'Buffer >50% may indicate estimate uncertainty — refine tasks' : 'Buffer within typical range for this work type' },
      ],
      extras: [
        { label: '📋 Parkinson\'s Law', value: '"Work expands to fill the time available." Set aggressive but realistic deadlines. Break large tasks into 2-4 hr chunks to maintain momentum.' },
        { label: '🎯 The 40-70 Rule', value: 'Make decisions with 40-70% of the information available. Less = missed factors. More = analysis paralysis. Apply this to task estimation too.' },
        { label: '⏳ Hofstadter\'s Law', value: '"It always takes longer than you expect, even when you take into account Hofstadter\'s Law." Double your initial estimate for complex projects.' },
        { label: '📊 Track Estimation Accuracy', value: 'Log estimated vs actual hours for every project. After 10 projects, calculate your personal bias factor. Most people underestimate by 30-50%.' },
        { label: '🔨 Task Breakdown Rule', value: 'No task should be >8 hours. If it is, decompose further. Small tasks (2-4 hrs) are estimated 3× more accurately than large ones (16+ hrs).' },
        { label: '🔄 Weekly Review Cycle', value: 'Re-estimate remaining work every week. The first estimate is the worst. By week 3, your prediction accuracy improves by ~40%.' },
        { label: '🎯 The Planning Fallacy', value: 'Humans systematically underestimate task time by 20-50%. Reference class forecasting — compare to similar past projects — improves accuracy by 30%.' },
        { label: '📅 Time Blocking Strategy', value: 'Reserve your daily capacity in 90-min focus blocks. The average knowledge worker gets only 2.5-3 hours of truly productive work per day.' },
      ]
    }
  },
  description: 'Estimate project completion time based on task count, hours per task, daily availability, work schedule, and a buffer for unexpected delays. Includes projected end date and buffer recommendations.',
  formula: 'Gross Hours = Tasks × Hrs/Task | Buffer = Gross × Buffer% | Adjusted = Gross + Buffer | Avg Daily Hrs = Daily hrs × WorkDays/7 | Calendar Days = Adjusted ÷ Avg Daily Hrs',
  interpretation: 'Include 20-30% buffer for knowledge work, 30-40% for complex or unfamiliar projects. The planning fallacy causes most people to underestimate by 20-50%. Track actual vs estimated hours to calibrate your personal bias. Break tasks larger than 8 hours into sub-tasks. Review and re-estimate weekly — accuracy improves by ~40% after the first 3 weeks of a project.'
}

export default calcDef

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
  defaults: { tasksCompleted: '6', tasksPlanned: '8', focusHours: '3', distractions: '4' },
  presets: [
    { label: 'Highly Productive Day', values: { tasksCompleted: '8', tasksPlanned: '8', focusHours: '5', distractions: '1' } },
    { label: 'Typical Office Day', values: { tasksCompleted: '5', tasksPlanned: '8', focusHours: '2.5', distractions: '6' } },
    { label: 'Distracted Day', values: { tasksCompleted: '3', tasksPlanned: '8', focusHours: '1', distractions: '12' } },
    { label: 'Deep Work Sprint', values: { tasksCompleted: '4', tasksPlanned: '4', focusHours: '6', distractions: '0' } },
  ],
  compute: (v) => {
    const completionRate = (v.tasksCompleted / v.tasksPlanned) * 100
    const focusPenalty = Math.min(v.distractions * 2, 40)
    const focusBonus = Math.min(v.focusHours * 5, 30)
    const prodScore = Math.min(100, Math.max(0, Math.round(completionRate * 0.6 + focusBonus - focusPenalty)))
    const rating = prodScore >= 80 ? 'Excellent' : prodScore >= 60 ? 'Good' : prodScore >= 40 ? 'Fair' : 'Needs Improvement'
    const recoveryCost = v.distractions * 23
    return { result: prodScore, label: 'Productivity Score', unit: '/100',
      steps: [
        { label: 'Task Completion Rate', value: `${v.tasksCompleted}/${v.tasksPlanned} = ${completionRate.toFixed(0)}%` },
        { label: 'Weighted Completion', value: `${completionRate.toFixed(0)}% × 0.6 = ${(completionRate * 0.6).toFixed(1)}` },
        { label: 'Deep Work Bonus', value: `Min(${v.focusHours} × 5, 30) = +${focusBonus.toFixed(0)}` },
        { label: 'Distraction Penalty', value: `Min(${v.distractions} × 2, 40) = -${focusPenalty.toFixed(0)}` },
        { label: 'Raw Score', value: `${(completionRate * 0.6).toFixed(1)} + ${focusBonus.toFixed(0)} - ${focusPenalty.toFixed(0)} = ${prodScore.toFixed(0)}` },
        { label: 'Final Score', value: `${prodScore.toFixed(0)}/100 — ${rating}` },
        { label: 'Recovery Time Lost', value: `${v.distractions} interruptions × 23 min avg recovery = ${recoveryCost} min (${(recoveryCost / 60).toFixed(1)} hrs)` },
        { label: 'Focus-to-Interruption Ratio', value: v.distractions > 0 ? `${(v.focusHours / v.distractions).toFixed(1)} hrs focus per interruption` : 'Perfect — no interruptions' },
      ],
      extras: [
        { label: '🎯 Deep Work Matters Most', value: 'Top performers average 4+ hrs of deep work daily. Each additional hour of focused time boosts productivity more than completing 2 extra small tasks.' },
        { label: '⏱️ The 23-Minute Recovery', value: 'After an interruption, it takes an average of 23 min to fully refocus (UC Irvine study). 6 interruptions = 138 min of lost productivity per day.' },
        { label: '📱 Notification Cost', value: 'The average worker checks their phone 96 times/day. Each glance costs 1-2 min of context recovery. Total: ~2.5 hrs lost to phone distractions daily.' },
        { label: '🧠 Flow State Requirements', value: 'Entering flow requires 15-25 min of uninterrupted focus. A single interruption during this window resets the timer. Schedule 90-min deep work blocks.' },
        { label: '📊 The 80/20 Rule of Tasks', value: '20% of your tasks produce 80% of the value. Rate your completion score against high-impact tasks, not busywork. Quality of completion matters more than quantity.' },
        { label: '🔄 Time Blocking Method', value: 'Assign specific hours to specific tasks. The average person switches tasks every 3 min when not time-blocking. Time-blocking reduces context switching by 70%.' },
        { label: '🌅 Morning Peak Performance', value: 'Most people\'s peak cognitive performance is 2-4 hours after waking. Schedule your hardest tasks here. Save email and meetings for the afternoon slump.' },
        { label: '⚡ Energy Management > Time', value: 'Working 8 hrs at 50% energy = 4 productive hours. Working 4 hrs at 100% energy = 4 hours. Prioritize energy management — sleep, exercise, and nutrition affect scores.' },
      ]
    }
  },
  description: 'Calculate a daily productivity score (0-100) based on task completion rate, hours of deep work, and interruption count. Includes recovery time analysis and actionable productivity insights.',
  formula: 'Score = (Completed/Planned × 100 × 0.6) + Min(FocusHrs × 5, 30) − Min(Interruptions × 2, 40). Score range: 0-100. Recovery Time = Interruptions × 23 min.',
  interpretation: 'Score 80+: highly productive day. 60-79: good with room for improvement. Below 60: evaluate time management strategies. Top performers average 4+ hours of deep work daily and limit interruptions via time-blocking. Each interruption costs 23 minutes of recovery time on average. The most productive people protect their morning hours for deep work and batch administrative tasks in the afternoon.'
}

export default calcDef

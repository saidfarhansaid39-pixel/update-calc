import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tbWorkHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tbTaskCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), tbBreakMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tbBlockMin: z.string().min(1).refine(v => parseFloat(v) >= 15, '>=15'), tbFocusPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'tbWorkHours', label: 'Available Hours/Day', type: 'number', min: 1, max: 16, step: '1' },
    { name: 'tbTaskCount', label: 'Number of Tasks', type: 'number', min: 1, step: '1' },
    { name: 'tbBreakMin', label: 'Break Between Blocks (min)', type: 'number', min: 0, step: '5' },
    { name: 'tbBlockMin', label: 'Time Block Length (min)', type: 'number', min: 15, step: '15' },
    { name: 'tbFocusPct', label: 'Focus Time (%)', type: 'number', min: 0, max: 100, step: '10' },
  ],
  defaults: { tbWorkHours: '8', tbTaskCount: '5', tbBreakMin: '10', tbBlockMin: '50', tbFocusPct: '80' },
  presets: [
    { label: 'Deep Work Day (90 min blocks)', values: { tbWorkHours: '8', tbTaskCount: '4', tbBreakMin: '15', tbBlockMin: '90', tbFocusPct: '100' } },
    { label: 'Pomodoro Method', values: { tbWorkHours: '6', tbTaskCount: '8', tbBreakMin: '5', tbBlockMin: '25', tbFocusPct: '100' } },
    { label: 'Balanced Work Day', values: { tbWorkHours: '8', tbTaskCount: '5', tbBreakMin: '10', tbBlockMin: '50', tbFocusPct: '80' } },
    { label: 'Student Study Session', values: { tbWorkHours: '5', tbTaskCount: '4', tbBreakMin: '10', tbBlockMin: '45', tbFocusPct: '90' } },
  ],
  compute: (v) => {
    const totalMin = v.tbWorkHours * 60
    const totalBlocks = Math.floor(totalMin / (v.tbBlockMin + v.tbBreakMin))
    const focusBlocks = Math.round(totalBlocks * (v.tbFocusPct / 100))
    const timePerTask = totalMin / v.tbTaskCount
    return { result: totalBlocks, label: 'Available Time Blocks', unit: 'blocks', steps: [
      { label: 'Formula', value: 'Blocks = TotalMin ÷ (BlockMin + BreakMin)' },
      { label: 'Total Time', value: v.tbWorkHours + 'h = ' + totalMin + ' min' },
      { label: 'Block + Break', value: v.tbBlockMin + ' min work + ' + v.tbBreakMin + ' min break = ' + (v.tbBlockMin + v.tbBreakMin) + ' min per cycle' },
      { label: 'Total Blocks', value: '' + totalBlocks + ' blocks possible' },
      { label: 'Focus Blocks', value: '' + focusBlocks + ' dedicated focus blocks (' + v.tbFocusPct + '% of time)' },
      { label: 'Time per Task', value: totalMin + ' min ÷ ' + v.tbTaskCount + ' tasks = ' + timePerTask.toFixed(0) + ' min/task' },
      { label: 'Productivity Rate', value: (totalBlocks * v.tbBlockMin) + ' min work out of ' + totalMin + ' min (' + (totalBlocks * v.tbBlockMin / totalMin * 100).toFixed(0) + '%)' },
    ] ,
    extras: [
      { label: 'Ultradian Rhythm', value: 'The brain naturally works best in 90-120 min cycles. Align your blocks with these natural energy peaks for maximum output' },
      { label: 'Pomodoro Method', value: '25 min work + 5 min break. After 4 cycles, take a 15-30 min break. Great for tasks you\'ve been procrastinating' },
      { label: 'Energy Management', value: 'Schedule your hardest tasks during peak energy (usually 2-4 hours after waking). Save low-focus work for post-lunch slump' },
      { label: 'The 60-40 Rule', value: 'Time block 60-70% of your day max. Leave 30-40% unscheduled for meetings, interruptions, and urgent tasks that inevitably arise' },
      { label: 'Task Batching', value: 'Group similar tasks (email, calls, admin) into single blocks. Context switching costs 20-40% productivity loss per switch' },
      { label: 'Deep Work', value: '90+ min uninterrupted blocks produce the highest quality output. Turn off notifications, close Slack/email, use focus mode' },
      { label: 'Morning Momentum', value: 'Research shows completing 2 focused blocks before lunch correlates with 3× higher daily output vs starting with email' },
      { label: 'Review & Adjust', value: 'At end of day, review what you actually accomplished vs planned. Adjust block lengths and task counts for next day\'s plan' },
    ]}
  },
  description: 'Plan your day with the time blocking productivity method. Calculate how many focused work blocks you can fit based on available hours, task count, break intervals, and focus percentage. Supports Pomodoro, deep work, and balanced scheduling.',
  formula: 'Total Blocks = floor(Total Minutes Available ÷ (Block Length + Break Length)). Focus Blocks = Total Blocks × Focus %. Time Per Task = Total Minutes ÷ Number of Tasks. Work Minutes = Total Blocks × Block Length.',
  interpretation: 'An 8-hour workday with 50-min blocks and 10-min breaks allows ~8 blocks (7h 20min productive time). With 5 tasks, each gets ~96 minutes. Optimal block length depends on task complexity: 25 min for shallow work (email, admin), 50 min for standard tasks, 90+ min for deep work requiring flow state. Top performers typically complete 3-5 focused blocks per day.'
}

export default calcDef

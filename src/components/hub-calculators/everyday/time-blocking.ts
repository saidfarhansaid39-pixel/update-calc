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
  compute: (v) => {
    const totalMin = v.tbWorkHours * 60
    const totalBlocks = Math.floor(totalMin / (v.tbBlockMin + v.tbBreakMin))
    const focusBlocks = Math.round(totalBlocks * (v.tbFocusPct / 100))
    const timePerTask = totalMin / v.tbTaskCount
    return { result: totalBlocks, label: 'Available Time Blocks', unit: 'blocks', steps: [{ label: 'Total Time', value: totalMin + ' min (' + v.tbWorkHours + 'h)' }, { label: 'Block + Break', value: v.tbBlockMin + ' + ' + v.tbBreakMin + ' min' }, { label: 'Total Blocks', value: '' + totalBlocks }, { label: 'Focus Blocks', value: '' + focusBlocks + ' (' + v.tbFocusPct + '%)' }, { label: 'Time per Task', value: timePerTask.toFixed(0) + ' min' }] }
  },
  description: 'Plan your day with time blocking. Calculate how many focused work blocks you can fit based on hours, tasks, breaks, and focus ratio.',
  formula: 'Blocks = TotalMin / (BlockMin + BreakMin) | FocusBlocks = Blocks x Focus% | TimePerTask = TotalMin / Tasks',
  interpretation: 'Optimal block length: 50-90 min (ultradian rhythm). Take 5-15 min breaks between blocks. Top performers average 4-5 focused blocks/day. Time block 60-70% of your day; leave 30-40% for interruptions.'
}

export default calcDef

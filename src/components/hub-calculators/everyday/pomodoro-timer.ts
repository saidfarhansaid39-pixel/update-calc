import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ focusMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), breakMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), longBreakMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cyclesBeforeLong: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), totalCycles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'focusMin', label: 'Focus Duration (min)', type: 'number', min: 5, max: 120, step: '5' },
    { name: 'breakMin', label: 'Short Break Duration (min)', type: 'number', min: 1, max: 30, step: '1' },
    { name: 'longBreakMin', label: 'Long Break Duration (min)', type: 'number', min: 5, max: 60, step: '5' },
    { name: 'cyclesBeforeLong', label: 'Cycles Before Long Break', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'totalCycles', label: 'Total Pomodoro Cycles', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const longBreaks = Math.floor(v.totalCycles / v.cyclesBeforeLong)
    const shortBreaks = v.totalCycles - longBreaks
    const totalFocusMin = v.totalCycles * v.focusMin
    const totalBreakMin = shortBreaks * v.breakMin + longBreaks * v.longBreakMin
    const totalMin = totalFocusMin + totalBreakMin
    const totalHrs = totalMin / 60
    return { result: totalMin, label: 'Total Session Time', unit: 'min', steps: [{ label: 'Focus Time', value: `${totalFocusMin} min` }, { label: 'Short Breaks', value: `${shortBreaks}×${v.breakMin} min` }, { label: 'Long Breaks', value: `${longBreaks}×${v.longBreakMin} min` }, { label: 'Total Time', value: `${totalMin} min (${totalHrs.toFixed(1)} hrs)` }] }
  },
  description: 'Plan your Pomodoro session schedule: calculate total time including focus blocks, short breaks, and long breaks.',
  formula: 'Total = Cycles×Focus + ShortBreaks×ShortBreak + LongBreaks×LongBreak',
  interpretation: 'Standard Pomodoro: 25 min focus, 5 min break. After 4 cycles, take 15-30 min long break. Adjust intervals based on your attention span. The technique boosts productivity through time-boxing and regular resets.'
}

export default calcDef

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
  defaults: { focusMin: '25', breakMin: '5', longBreakMin: '15', cyclesBeforeLong: '4', totalCycles: '4' },
  presets: [
    { label: 'Classic Pomodoro (4 cycles)', values: { focusMin: '25', breakMin: '5', longBreakMin: '15', cyclesBeforeLong: '4', totalCycles: '4' } },
    { label: '52/17 (Ultradian Rhythm)', values: { focusMin: '52', breakMin: '17', longBreakMin: '30', cyclesBeforeLong: '2', totalCycles: '4' } },
    { label: '90-Min Deep Work Block', values: { focusMin: '90', breakMin: '20', longBreakMin: '30', cyclesBeforeLong: '2', totalCycles: '2' } },
    { label: 'Light Focus Day', values: { focusMin: '15', breakMin: '5', longBreakMin: '10', cyclesBeforeLong: '3', totalCycles: '6' } },
  ],
  compute: (v) => {
    const longBreaks = Math.floor(v.totalCycles / v.cyclesBeforeLong)
    const shortBreaks = v.totalCycles - longBreaks
    const totalFocusMin = v.totalCycles * v.focusMin
    const totalBreakMin = shortBreaks * v.breakMin + longBreaks * v.longBreakMin
    const totalMin = totalFocusMin + totalBreakMin
    const totalHrs = totalMin / 60
    const focusRatio = totalMin > 0 ? (totalFocusMin / totalMin) * 100 : 0
    const endTime = new Date(Date.now() + totalMin * 60000)
    return { result: totalMin, label: 'Total Session Time', unit: 'min',
      steps: [
        { label: 'Focus Blocks', value: `${v.totalCycles} × ${v.focusMin} min = ${totalFocusMin} min` },
        { label: 'Short Breaks', value: `${shortBreaks} × ${v.breakMin} min = ${shortBreaks * v.breakMin} min` },
        { label: 'Long Breaks', value: `${longBreaks} × ${v.longBreakMin} min = ${longBreaks * v.longBreakMin} min` },
        { label: 'Total Break Time', value: `${totalBreakMin} min (${(totalBreakMin / 60).toFixed(1)} hrs)` },
        { label: 'Total Session', value: `${totalFocusMin} + ${totalBreakMin} = ${totalMin} min (${totalHrs.toFixed(1)} hrs)` },
        { label: 'Focus-to-Break Ratio', value: `${focusRatio.toFixed(0)}% focus, ${(100 - focusRatio).toFixed(0)}% breaks` },
        { label: 'Finishes At', value: endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
        { label: 'Cycle Schedule', value: `${v.totalCycles} cycle(s), long break every ${v.cyclesBeforeLong} cycle(s)` },
      ],
      extras: [
        { label: '🍅 The Pomodoro Origin', value: 'Developed by Francesco Cirillo in the late 1980s. Named after the tomato-shaped kitchen timer he used as a university student. "Pomodoro" means tomato in Italian.' },
        { label: '🧠 The 25-Minute Sweet Spot', value: '25 min is short enough to avoid procrastination (it\'s just 25 min) but long enough to get into flow. Research suggests the brain\'s attentional blink occurs around 20-30 min.' },
        { label: '⏱️ The Ultradian Rhythm (52/17)', value: 'Some researchers suggest a 52-min focus / 17-min break cycle aligns with the brain\'s natural ultradian rhythm. Used by high-performers and tested at Draugiem Group with 10%+ productivity improvement.' },
        { label: '🔁 The Zeigarnik Effect', value: 'Unfinished tasks occupy mental space. Pomodoro leverages this — stopping mid-task makes you eager to return. The brain remembers incomplete tasks better than completed ones.' },
        { label: '⚡ Why Long Breaks Matter', value: 'After ~4 cycles, focus degrades significantly. A 15-30 min long break allows the prefrontal cortex to reset. Skipping long breaks leads to diminishing returns and mental fatigue.' },
        { label: '🎯 Customizing Your Focus Duration', value: 'Experiment: start with 25 min, adjust ±5 min each week. Too easy to maintain? Increase. Find yourself checking the clock? Decrease. Your ideal focus window is personal.' },
        { label: '📱 Best Pomodoro Apps', value: 'Forest (gamified), Be Focused (iOS), Pomodoro Tracker (web), Toggl Track (with time tracking). Most have customizable intervals and analytics to track your focus patterns.' },
        { label: '💡 Pair With Time Blocking', value: 'Plan your day by assigning specific Pomodoro cycles to specific tasks. Batch similar tasks into adjacent cycles to reduce context switching. Review completed cycles at end of day.' },
      ]
    }
  },
  description: 'Plan your Pomodoro Technique session with fully customizable focus blocks, short breaks, and long breaks. Get total session time, focus-to-break ratio, end time, and a detailed cycle-by-cycle schedule.',
  formula: 'Total Time = (Cycles × Focus Min) + (Short Breaks × Short Break Min) + (Long Breaks × Long Break Min) | Long Breaks = Floor(Cycles ÷ Cycles Before Long) | Short Breaks = Total Cycles − Long Breaks',
  interpretation: 'The classic Pomodoro Technique uses 25 min focus / 5 min break cycles with a 15-30 min long break after every 4 cycles. This 25/5/4 rhythm is supported by research on attentional limits — most people\'s sustained focus begins to decline after 20-30 minutes. The 52/17 "ultradian" variant may better match natural energy rhythms for some. The key principle is time-boxing: committing to focused work for a defined period builds consistency and reduces the aversion to starting difficult tasks.'
}

export default calcDef

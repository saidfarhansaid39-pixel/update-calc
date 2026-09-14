import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const cycleLen = 90
const recommendations: { min: number; max: number; label: string }[] = [
  { min: 0, max: 2, label: 'Newborn (0-3 months): 14-17 h' },
  { min: 2, max: 11, label: 'Infant (4-11 months): 12-15 h' },
  { min: 11, max: 13, label: 'Toddler (1-2 years): 11-14 h' },
  { min: 13, max: 18, label: 'Preschool (3-5 years): 10-13 h' },
  { min: 18, max: 24, label: 'School-age (6-13 years): 9-11 h' },
  { min: 24, max: 64, label: 'Adult (18-64 years): 7-9 h' },
  { min: 64, max: 150, label: 'Older adult (65+): 7-8 h' },
]

function ageRec(age: number): string {
  const r = recommendations.find(r => age >= r.min && age < r.max)
  return r ? r.label : 'Adult (18-64): 7-9 h'
}

const calcDef: CalcDef = {
  schema: z.object({ wakeTime: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cycleLength: z.string().min(1).refine(v => parseFloat(v) >= 60, '>=60'), desiredCycles: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), fallAsleepMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wakeTime', label: 'Wake Up Time (minutes from midnight)', type: 'number', min: 0, max: 1440, step: '15' },
    { name: 'cycleLength', label: 'Sleep Cycle Length (min)', type: 'number', min: 60, max: 120, step: '5' },
    { name: 'desiredCycles', label: 'Desired Sleep Cycles', type: 'number', min: 1, max: 8, step: '1' },
    { name: 'fallAsleepMin', label: 'Minutes to Fall Asleep', type: 'number', min: 0, max: 60, step: '5' },
  ],
  defaults: { wakeTime: '420', cycleLength: '90', desiredCycles: '5', fallAsleepMin: '15' },
  presets: [
    { label: '5 cycles (7.5 h)', values: { wakeTime: '420', cycleLength: '90', desiredCycles: '5', fallAsleepMin: '15' } },
    { label: '6 cycles (9 h)', values: { wakeTime: '420', cycleLength: '90', desiredCycles: '6', fallAsleepMin: '15' } },
    { label: '4 cycles (6 h)', values: { wakeTime: '360', cycleLength: '90', desiredCycles: '4', fallAsleepMin: '10' } },
    { label: 'Nap (1 cycle)', values: { wakeTime: '900', cycleLength: '90', desiredCycles: '1', fallAsleepMin: '5' } },
  ],
  compute: (v) => {
    const cycleMinutes = v.cycleLength * v.desiredCycles
    const totalSleep = cycleMinutes + v.fallAsleepMin
    const bedTime = v.wakeTime - totalSleep
    const adjustedBedTime = bedTime < 0 ? bedTime + 1440 : bedTime
    const totalSleepHrs = cycleMinutes / 60
    const bedHr = Math.floor(adjustedBedTime / 60) % 24
    const bedMin = Math.round(adjustedBedTime % 60)
    const wakeHr = Math.floor(v.wakeTime / 60) % 24
    const wakeMin = Math.round(v.wakeTime % 60)
    const lightMin = cycleMinutes * 0.55
    const deepMin = cycleMinutes * 0.20
    const remMin = cycleMinutes * 0.25
    return {
      result: totalSleepHrs, label: 'Total Sleep Time', unit: 'hrs',
      steps: [
        { label: 'Bedtime', value: `${bedHr.toString().padStart(2, '0')}:${bedMin.toString().padStart(2, '0')}` },
        { label: 'Wake time', value: `${wakeHr.toString().padStart(2, '0')}:${wakeMin.toString().padStart(2, '0')}` },
        { label: 'Sleep cycles', value: `${v.desiredCycles} × ${v.cycleLength} min` },
        { label: 'Time to fall asleep', value: `${v.fallAsleepMin} min` },
        { label: 'Total sleep', value: `${totalSleepHrs.toFixed(1)} h` },
        { label: 'Light sleep (~55%)', value: `${Math.round(lightMin)} min (${(lightMin / 60).toFixed(1)} h)` },
        { label: 'Deep sleep (~20%)', value: `${Math.round(deepMin)} min (${(deepMin / 60).toFixed(1)} h)` },
        { label: 'REM sleep (~25%)', value: `${Math.round(remMin)} min (${(remMin / 60).toFixed(1)} h)` },
      ],
      extras: [
        { label: 'Bedtime', value: `${bedHr.toString().padStart(2, '0')}:${bedMin.toString().padStart(2, '0')}` },
        { label: 'Wake time', value: `${wakeHr.toString().padStart(2, '0')}:${wakeMin.toString().padStart(2, '0')}` },
        { label: 'Total sleep', value: totalSleepHrs.toFixed(1) + ' h' },
        { label: 'Sleep cycles', value: `${v.desiredCycles} (${v.cycleLength} min each)` },
        { label: 'Light sleep', value: `${Math.round(lightMin)} min (${(lightMin / 60).toFixed(1)} h)` },
        { label: 'Deep sleep', value: `${Math.round(deepMin)} min (${(deepMin / 60).toFixed(1)} h)` },
        { label: 'REM sleep', value: `${Math.round(remMin)} min (${(remMin / 60).toFixed(1)} h)` },
        { label: 'NSF adult recommendation', value: '7-9 hours (5-6 full cycles)' },
        { label: 'Age recommendation', value: ageRec(30) },
        { label: 'Sleep hygiene tip', value: 'Avoid screens 30-60 min before bed. Keep room cool (18-22°C).' },
        { label: 'Nap tip', value: 'Short nap: 20 min (no inertia). Full nap: 90 min (1 full cycle).' },
        { label: 'Wake between cycles tip', value: 'Waking mid-cycle causes sleep inertia. Time bedtime so you wake at cycle end.' },
      ],
    }
  },
  description: 'Find the optimal bedtime based on wake time and sleep cycles. Wake up between cycles for a refreshed feeling using sleep cycle math.',
  formula: 'Bedtime = WakeTime - (Cycles×CycleMin + FallAsleepMin) | Avg cycle: 90 min',
  interpretation: 'Sleep cycles last 80-120 min. Waking mid-cycle causes sleep inertia. 5-6 cycles (7.5-9 h) recommended for adults. First cycles have most deep sleep; later cycles have more REM.'
}

export default calcDef

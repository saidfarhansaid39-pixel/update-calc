import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wakeTime: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cycleLength: z.string().min(1).refine(v => parseFloat(v) >= 60, '>=60'), desiredCycles: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), fallAsleepMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wakeTime', label: 'Wake Up Time (minutes from midnight)', type: 'number', min: 0, max: 1440, step: '15' },
    { name: 'cycleLength', label: 'Sleep Cycle Length (min)', type: 'number', min: 60, max: 120, step: '5' },
    { name: 'desiredCycles', label: 'Desired Sleep Cycles', type: 'number', min: 1, max: 8, step: '1' },
    { name: 'fallAsleepMin', label: 'Minutes to Fall Asleep', type: 'number', min: 0, max: 60, step: '5' },
  ],
  compute: (v) => {
    const cycleMinutes = v.cycleLength * v.desiredCycles
    const totalSleep = cycleMinutes + v.fallAsleepMin
    const bedTime = v.wakeTime - totalSleep
    const adjustedBedTime = bedTime < 0 ? bedTime + 1440 : bedTime
    const totalSleepHrs = cycleMinutes / 60
    const bedHr = Math.floor(adjustedBedTime / 60) % 24
    const bedMin = Math.round(adjustedBedTime % 60)
    return { result: totalSleepHrs, label: 'Total Sleep Time', unit: 'hrs', steps: [{ label: 'Bedtime', value: `${bedHr}:${bedMin.toString().padStart(2, '0')}` }, { label: 'Wake Time', value: `${Math.floor(v.wakeTime / 60)}:${(Math.round(v.wakeTime % 60)).toString().padStart(2, '0')}` }, { label: 'Sleep Cycles', value: `${v.desiredCycles} × ${v.cycleLength} min` }, { label: 'Total Sleep', value: `${totalSleepHrs.toFixed(1)} hrs` }] }
  },
  description: 'Find the optimal bedtime based on wake time and sleep cycles. Wake up between cycles for a refreshed feeling using sleep cycle math.',
  formula: 'Bedtime = WakeTime - (Cycles×CycleMin + FallAsleepMin) | Avg cycle: 90 min',
  interpretation: 'Sleep cycles last 80-120 min. Waking mid-cycle causes grogginess (sleep inertia). 5-6 cycles (7.5-9 hrs) is recommended for adults. The first two cycles have the most deep sleep; later cycles have more REM.'
}

export default calcDef

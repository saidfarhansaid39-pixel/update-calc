import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cycleLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), periodLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lastPeriodDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lutealPhase: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'cycleLength', label: 'Average Cycle Length (days)', type: 'number', min: 21, max: 45, step: '1' },
    { name: 'periodLength', label: 'Average Period Length (days)', type: 'number', min: 2, max: 10, step: '1' },
    { name: 'lastPeriodDay', label: 'Day of Last Period Start (1-28)', type: 'number', min: 1, max: 31, step: '1' },
    { name: 'lutealPhase', label: 'Luteal Phase Length (days)', type: 'number', min: 10, max: 16, step: '1' },
  ],
  compute: (v) => {
    const ovulationDay = v.cycleLength - v.lutealPhase
    const nextPeriodDay = v.lastPeriodDay + v.cycleLength
    const fertileStart = ovulationDay - 5
    const fertileEnd = ovulationDay + 1
    const nextCycle = nextPeriodDay
    const daysUntilOvulation = ovulationDay - (v.lastPeriodDay % v.cycleLength || v.cycleLength)
    return { result: ovulationDay, label: 'Approximate Ovulation Day', unit: 'day of cycle', steps: [{ label: 'Cycle Length', value: `${v.cycleLength} days` }, { label: 'Ovulation Day', value: `Day ${ovulationDay} of cycle` }, { label: 'Fertile Window', value: `Days ${Math.max(1, fertileStart)}-${fertileEnd}` }, { label: 'Next Period Est.', value: `Day ${nextPeriodDay > 31 ? nextPeriodDay - 31 : nextPeriodDay}` }, { label: 'Days Until Ovulation', value: `${daysUntilOvulation >= 0 ? daysUntilOvulation : daysUntilOvulation + v.cycleLength} days` }] }
  },
  description: 'Track menstrual cycle phases: estimate ovulation day, fertile window, and next period date based on cycle data.',
  formula: 'Ovulation = CycleLength - LutealPhase | Fertile = Ovulation-5 to Ovulation+1 | Next = LastPeriodStart + CycleLength',
  interpretation: 'Average cycle: 28 days (21-45 normal). Ovulation: ~day 14 in a 28-day cycle. Luteal phase typically 14 days. Fertile window: 6 days ending on ovulation day. Sperm survive 5 days, egg 24 hours.'
}

export default calcDef

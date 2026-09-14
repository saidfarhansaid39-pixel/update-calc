import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cycleLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), periodLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lastPeriodDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lutealPhase: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'cycleLength', label: 'Average Cycle Length (days)', type: 'number', min: 21, max: 45, step: '1' },
    { name: 'periodLength', label: 'Average Period Length (days)', type: 'number', min: 2, max: 10, step: '1' },
    { name: 'lastPeriodDay', label: 'Day of Last Period Start (1-31)', type: 'number', min: 1, max: 31, step: '1' },
    { name: 'lutealPhase', label: 'Luteal Phase Length (days)', type: 'number', min: 10, max: 16, step: '1' },
  ],
  defaults: { cycleLength: '28', periodLength: '5', lastPeriodDay: '1', lutealPhase: '14' },
  presets: [
    { label: '28-Day Cycle (average)', values: { cycleLength: '28', periodLength: '5', lastPeriodDay: '1', lutealPhase: '14' } },
    { label: 'Short Cycle (24 days)', values: { cycleLength: '24', periodLength: '4', lastPeriodDay: '15', lutealPhase: '12' } },
    { label: 'Long Cycle (35 days)', values: { cycleLength: '35', periodLength: '6', lastPeriodDay: '10', lutealPhase: '14' } },
    { label: 'Tracking Conception', values: { cycleLength: '28', periodLength: '4', lastPeriodDay: '5', lutealPhase: '14' } },
  ],
  compute: (v) => {
    const follicularPhase = v.cycleLength - v.lutealPhase
    const ovulationDay = Math.max(1, follicularPhase)
    const fertileStart = Math.max(1, ovulationDay - 5)
    const fertileEnd = ovulationDay + 1
    const nextPeriodDayNum = v.lastPeriodDay + v.cycleLength
    const cycleDay = (v.lastPeriodDay - 1) % v.cycleLength + 1
    const daysUntilOvulation = ovulationDay - cycleDay
    const daysRemaining = v.cycleLength - cycleDay
    const cyclePhase = cycleDay <= v.periodLength ? 'Menstruation' : cycleDay <= ovulationDay ? 'Follicular Phase' : cycleDay <= ovulationDay + 1 ? 'Ovulation' : 'Luteal Phase'
    return { result: ovulationDay, label: 'Ovulation Day', unit: 'day of cycle', steps: [
      { label: 'Cycle Length', value: `${v.cycleLength} days` },
      { label: 'Period Length', value: `${v.periodLength} days` },
      { label: 'Follicular Phase (pre-ovulation)', value: `${follicularPhase} days (days 1-${follicularPhase})` },
      { label: 'Ovulation Day', value: `Day ${ovulationDay}` },
      { label: 'Fertile Window', value: `Days ${fertileStart} to ${fertileEnd} (${fertileEnd - fertileStart + 1} days)` },
      { label: 'Luteal Phase (post-ovulation)', value: `${v.lutealPhase} days (days ${ovulationDay + 1}-${v.cycleLength})` },
      { label: 'Current Cycle Phase', value: cyclePhase },
      { label: 'Next Period Estimate', value: nextPeriodDayNum > 31 ? `Day ${nextPeriodDayNum - 31} of next month` : `Day ${nextPeriodDayNum}` },
    ] ,
    extras: [
      { label: 'Average Cycle', value: 'The average cycle is 28 days, but cycles between 21-45 days are normal. Only ~13% of women have a 28-day cycle.' },
      { label: 'Fertile Window', value: 'Sperm can survive up to 5 days in the female reproductive tract. The egg is viable for ~24 hours after ovulation. The fertile window is ~6 days total.' },
      { label: 'Ovulation Predictors', value: 'Track basal body temperature (BBT), cervical mucus changes, and use ovulation predictor kits (OPKs) for more accurate ovulation detection.' },
      { label: 'Cycle Variability', value: 'Cycle length can vary 7-9 days between cycles and still be considered normal. Stress, travel, illness, and weight changes can shift ovulation.' },
      { label: 'Luteal Phase Importance', value: `Your luteal phase: ${v.lutealPhase} days (normal: 12-16). A luteal phase under 10 days may make conception difficult (luteal phase defect).` },
      { label: 'Period Tracking Benefits', value: 'Tracking helps identify ovulation, predict periods, detect irregularities, and provides useful data for healthcare providers about your reproductive health.' },
    ]}
  },
  description: 'Track your menstrual cycle phases and estimate key dates: ovulation day, fertile window, and next period. Input your cycle length, period length, luteal phase, and last period start date for personalized predictions.',
  formula: 'OvulationDay = CycleLength − LutealPhase | FertileWindow = Days [OvulationDay−5, OvulationDay+1] | FollicularPhase = CycleLength − LutealPhase | LutealPhase typically 14 days | NextPeriod = LastPeriodStart + CycleLength',
  interpretation: 'In a textbook 28-day cycle, ovulation occurs around day 14 and the fertile window spans days 9-15. Sperm survive up to 5 days, so intercourse in the 5 days before ovulation can lead to conception. The luteal phase is relatively fixed (12-16 days) for most women, while the follicular phase varies and is responsible for cycle length differences. Period tracking apps using calendar methods alone are ~80% accurate; adding BBT tracking increases accuracy to ~95%.'
}

export default calcDef

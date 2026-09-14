import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wakeTime: z.string().min(1, 'Required'), napDuration: z.string().min(1).refine(v => parseFloat(v) >= 5, '>=5'), napHour: z.string().min(1).refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 23, '0-23') }),
  fields: [
    { name: 'wakeTime', label: 'Wake Up Time (HH:MM)', type: 'text' },
    { name: 'napHour', label: 'Nap Start Hour (0-23)', type: 'number', min: 0, max: 23, step: '1' },
    { name: 'napDuration', label: 'Nap Duration (minutes)', type: 'number', min: 5, max: 120, step: '5' },
  ],
  defaults: { wakeTime: '07:00', napHour: '14', napDuration: '20' },
  presets: [
    { label: 'Power Nap', values: { wakeTime: '07:00', napHour: '14', napDuration: '20' } },
    { label: 'Full Sleep Cycle', values: { wakeTime: '06:30', napHour: '13', napDuration: '90' } },
    { label: 'NREM Recovery', values: { wakeTime: '07:30', napHour: '15', napDuration: '45' } },
    { label: 'Early Bird Reset', values: { wakeTime: '05:00', napHour: '12', napDuration: '20' } },
  ],
  compute: (v) => { const wakeHour = parseInt(v.wakeTime.split(':')[0]) || 7; const wakeMin = parseInt(v.wakeTime.split(':')[1]) || 0; const wakeMinutes = wakeHour * 60 + wakeMin; const napMinutes = v.napHour * 60; const hoursAwake = (napMinutes - wakeMinutes + 1440) % 1440 / 60; const afterNap = napMinutes + v.napDuration; const afterNapHour = Math.floor(afterNap / 60) % 24; const afterNapMin = afterNap % 60; const stage = v.napDuration <= 20 ? 'Power Nap (Stage 2)' : v.napDuration <= 45 ? 'NREM Nap' : 'Full Sleep Cycle (90 min)'; const best = hoursAwake >= 6 && hoursAwake <= 10; const afterNapTime = `${afterNapHour.toString().padStart(2, '0')}:${afterNapMin.toString().padStart(2, '0')}`; const sleepInertia = v.napDuration > 20 && v.napDuration < 90 ? 'HIGH (waking during deep sleep)' : v.napDuration <= 20 ? 'LOW (Stage 2 nap)' : 'MODERATE (complete cycle, may feel groggy initially)'; return { result: v.napDuration, label: 'Nap Duration', unit: 'min', steps: [
    { label: 'Wake Time', value: `${v.wakeTime}` },
    { label: 'Nap Start', value: `${v.napHour.toString().padStart(2, '0')}:00` },
    { label: 'Hours Awake Before Nap', value: `${hoursAwake.toFixed(1)} hours (${hoursAwake >= 6 ? '✓ in optimal window' : '⚠ outside optimal 6-10 hr window'})` },
    { label: 'Nap Duration', value: `${v.napDuration} minutes` },
    { label: 'Nap Type', value: stage },
    { label: 'Expected Sleep Inertia', value: sleepInertia },
    { label: 'Wake Up Time', value: afterNapTime },
  ] ,
    extras: [
      { label: 'Power Nap (10-20 min)', value: 'Boosts alertness and motor performance with minimal sleep inertia — ideal for a midday refresh.' },
      { label: 'NREM Nap (30-45 min)', value: 'Include slow-wave sleep. Best for creativity and memory consolidation, but wakes during deep sleep causing grogginess.' },
      { label: 'Full Cycle (90 min)', value: 'Complete one full sleep cycle including REM. Improves emotional memory and creativity. Best if you have 90+ minutes available.' },
      { label: 'Best Nap Window', value: '1:00-3:00 PM (6-10 hrs after waking) aligns with the body\'s natural circadian dip. Napping after 4 PM may disrupt nighttime sleep.' },
      { label: 'Caffeine Nap', value: 'Drink coffee right before a 20-min nap. Caffeine takes ~20 min to activate — you wake up as it kicks in, doubling alertness.' },
      { label: 'Nap Frequency', value: 'Aim for 1 nap per day max. Frequent or long naps (>90 min) may indicate sleep debt or underlying sleep disorders.' },
    ]} },
  description: 'Plan the perfect nap based on your wake-up time and desired duration. Avoid sleep inertia with science-backed nap timing and learn which nap type suits your needs.',
  formula: 'HoursAwake = (NapStartHour × 60 − WakeMinutes + 1440) % 1440 / 60 | NapType: ≤20 min = Power Nap(NREM Stage 2), 20-45 min = NREM, 45+ = Full Cycle(90 min)',
  interpretation: 'Power naps (10-20 min) boost alertness without grogginess — ideal for midday. The 30-min range causes sleep inertia because you wake during deep sleep. A full 90-min cycle is best when you have time. The ideal nap window is 6-10 hours after waking (typically 1-3 PM for most people). Napping after 4 PM risks disrupting nighttime sleep for many people.'
}

export default calcDef

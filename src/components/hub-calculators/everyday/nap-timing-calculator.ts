import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wakeTime: z.string().min(1, 'Required'), napDuration: z.string().min(1).refine(v => parseFloat(v) >= 5, '>=5'), napHour: z.string().min(1).refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 23, '0-23') }),
  fields: [
    { name: 'wakeTime', label: 'Wake Up Time (HH:MM)', type: 'text' },
    { name: 'napHour', label: 'Nap Start Hour (0-23)', type: 'number', min: 0, max: 23, step: '1' },
    { name: 'napDuration', label: 'Nap Duration (minutes)', type: 'number', min: 5, max: 120, step: '5' },
  ],
  compute: (v) => { const wakeHour = parseInt(v.wakeTime.split(':')[0]) || 7; const wakeMin = parseInt(v.wakeTime.split(':')[1]) || 0; const wakeMinutes = wakeHour * 60 + wakeMin; const napMinutes = v.napHour * 60; const hoursAwake = (napMinutes - wakeMinutes + 1440) % 1440 / 60; const afterNap = napMinutes + v.napDuration; const afterNapHour = Math.floor(afterNap / 60) % 24; const afterNapMin = afterNap % 60; const stage = v.napDuration <= 20 ? 'Power Nap (Stage 2)' : v.napDuration <= 45 ? 'NREM Nap' : 'Full Sleep Cycle'; const best = hoursAwake >= 6 && hoursAwake <= 10; return { result: v.napDuration, label: 'Nap Duration', unit: 'min', steps: [{ label: 'Woke at', value: v.wakeTime }, { label: 'Nap Start', value: `${v.napHour}:00` }, { label: 'Hours Awake Before Nap', value: `${hoursAwake.toFixed(1)} hrs` }, { label: 'Nap Type', value: stage }, { label: 'Wake After Nap', value: `${afterNapHour.toString().padStart(2, '0')}:${afterNapMin.toString().padStart(2, '0')}` }] } },
  description: 'Find the optimal nap time based on your wake-up time and desired duration for energy restoration without sleep inertia.',
  formula: 'Optimal Nap Window = 6-10 hours after waking | Power Nap: 10-20 min | Full Cycle: 90 min',
  interpretation: 'Power naps (10-20 min) boost alertness without grogginess. 30-min naps cause sleep inertia. 90-min naps complete a full cycle. Best nap window: early afternoon (1-3 PM). Avoid napping after 4 PM.'
}

export default calcDef

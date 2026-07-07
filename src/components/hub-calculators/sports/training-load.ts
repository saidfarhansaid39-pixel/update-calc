import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    durationMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    avgHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    restingHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    maxHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    rpe: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 1 && val <= 10 }, '1-10')
}),
  fields: [
    { name: 'durationMin', label: 'Session Duration', type: 'number', unit: 'min', min: 1, step: '5' },
    { name: 'avgHR', label: 'Average Heart Rate', type: 'number', unit: 'bpm', min: 40, step: '1' },
    { name: 'restingHR', label: 'Resting HR', type: 'number', unit: 'bpm', min: 30, step: '1' },
    { name: 'maxHR', label: 'Max HR', type: 'number', unit: 'bpm', min: 100, step: '1' },
    { name: 'rpe', label: 'RPE (1-10)', type: 'number', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const hrr = (v.avgHR - v.restingHR) / (v.maxHR - v.restingHR)
    const trimp = v.durationMin * hrr * 0.64 * Math.exp(1.92 * hrr)
    const rpeLoad = v.durationMin * v.rpe
    return {
      result: trimp, label: 'TRIMP (Training Impulse)', unit: 'AU',
      steps: [
        { label: 'Duration', value: `${v.durationMin} min` },
        { label: 'HR reserve used', value: `${(hrr * 100).toFixed(0)}%` },
        { label: 'TRIMP score', value: `${trimp.toFixed(0)} AU` },
        { label: 'RPE load (min × RPE)', value: `${rpeLoad.toFixed(0)} AU` },
        { label: 'Training load category', value: trimp < 50 ? 'Easy' : trimp < 100 ? 'Moderate' : trimp < 200 ? 'Hard' : 'Very Hard' },
      ]
}
  },
  description: 'Calculate Training Impulse (TRIMP) using heart rate and RPE. TRIMP quantifies training load by combining session duration, heart rate intensity, and perceived effort for scientific training monitoring.'
}

export default calcDef

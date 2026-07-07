import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    restingHR: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 30 && val <= 120 }, '30-120 bpm')
}),
  fields: [
    { name: 'restingHR', label: 'Resting Heart Rate', type: 'number', unit: 'bpm', min: 30, max: 120, step: '1' },
  ],
  compute: (v) => {
    const hr = v.restingHR
    const rating = hr < 50 ? 'Athlete / Excellent' : hr < 60 ? 'Very Good' : hr < 70 ? 'Good' : hr < 80 ? 'Fair' : 'Poor / Needs improvement'
    return {
      result: hr, label: 'Resting HR', unit: 'bpm',
      steps: [
        { label: 'Measured RHR', value: `${hr} bpm` },
        { label: 'Fitness rating', value: rating },
        { label: 'Risk category', value: hr > 80 ? 'Elevated cardiovascular risk' : 'Normal range' },
        { label: 'Note', value: 'Lower resting HR generally indicates better cardiovascular fitness. Measure upon waking before getting out of bed.' },
      ]
}
  },
  description: 'Assess your cardiovascular fitness based on resting heart rate (RHR). A normal adult RHR is 60-100 bpm; well-trained athletes often have RHRs of 40-60 bpm.'
}

export default calcDef

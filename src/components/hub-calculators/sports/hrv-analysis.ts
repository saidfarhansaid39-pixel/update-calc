import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    rrIntervals: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    meanHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'rrIntervals', label: 'Average RR Interval', type: 'number', unit: 'ms', min: 500, max: 1500, step: '1' },
    { name: 'meanHR', label: 'Mean Heart Rate', type: 'number', unit: 'bpm', min: 30, max: 120, step: '1' },
  ],
  compute: (v) => {
    const rmssd = (60000 / v.meanHR) * 0.037
    const sdnn = rmssd * 1.35
    const hrvScore = rmssd * 20
    const rating = hrvScore > 80 ? 'Excellent (well recovered)' : hrvScore > 50 ? 'Good (normal recovery)' : hrvScore > 30 ? 'Fair (recovering)' : 'Low (fatigue/stress)'
    return {
      result: hrvScore, label: 'HRV Score', unit: '',
      steps: [
        { label: 'Mean HR', value: `${v.meanHR} bpm` },
        { label: 'RR interval', value: `${v.rrIntervals} ms` },
        { label: 'Est. RMSSD', value: `${rmssd.toFixed(2)} ms` },
        { label: 'Est. SDNN', value: `${sdnn.toFixed(2)} ms` },
        { label: 'HRV Score', value: `${hrvScore.toFixed(1)}` },
        { label: 'Recovery status', value: rating },
      ]
}
  },
  description: 'Analyze Heart Rate Variability (HRV) from resting heart rate data. Higher HRV indicates better autonomic nervous system balance and recovery status. RMSSD is the primary time-domain HRV metric.'
}

export default calcDef

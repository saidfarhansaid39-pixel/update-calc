import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    week1: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    week2: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    week3: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    week4: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    acuteWeek: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'week1', label: 'Week -4 (chronic)', type: 'number', unit: 'load', min: 0, step: '1' },
    { name: 'week2', label: 'Week -3 (chronic)', type: 'number', unit: 'load', min: 0, step: '1' },
    { name: 'week3', label: 'Week -2 (chronic)', type: 'number', unit: 'load', min: 0, step: '1' },
    { name: 'week4', label: 'Week -1 (chronic)', type: 'number', unit: 'load', min: 0, step: '1' },
    { name: 'acuteWeek', label: 'This Week (acute)', type: 'number', unit: 'load', min: 0, step: '1' },
  ],
  compute: (v) => {
    const chronic = (v.week1 + v.week2 + v.week3 + v.week4) / 4
    const acwr = chronic > 0 ? v.acuteWeek / chronic : 0
    const risk = acwr > 1.5 ? 'High injury risk zone (>1.5)' : acwr > 1.3 ? 'Moderate risk (1.3-1.5)' : acwr > 0.8 ? 'Optimal training zone' : acwr > 0.5 ? 'Low training stimulus' : 'Detraining risk'
    return {
      result: acwr, label: 'Acute:Chronic Workload Ratio', unit: '',
      steps: [
        { label: 'Chronic (4-week avg)', value: `${chronic.toFixed(0)}` },
        { label: 'Acute (this week)', value: `${v.acuteWeek}` },
        { label: 'ACWR', value: `${acwr.toFixed(2)}` },
        { label: 'Interpretation', value: risk },
        { label: 'Recommendation', value: acwr > 1.5 ? 'Reduce volume to prevent injury' : acwr > 0.8 ? 'Maintain current training' : 'Gradually increase load' },
      ]
}
  },
  description: 'Calculate the Acute:Chronic Workload Ratio (ACWR) to monitor training load balance. An ACWR between 0.8-1.3 is the optimal training zone; values above 1.5 significantly increase injury risk.'
}

export default calcDef

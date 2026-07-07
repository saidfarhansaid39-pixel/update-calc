import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hrPost: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120') }),
  fields: [
    { name: 'hrPost', label: 'Post-Test Heart Rate', type: 'number', unit: 'bpm', min: 60, step: '1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
  ],
  compute: (v) => {
    const vo2 = 3.5 + v.hrPost * 0.12
    return { result: vo2, label: 'Estimated VO2max', unit: 'mL/kg/min', steps: [
      { label: 'Post-exercise HR', value: v.hrPost+' bpm' },
      { label: 'VO2max estimate', value: vo2.toFixed(1)+' mL/kg/min' },
      { label: 'Protocol', value: 'YMCA 3-min step test (30 cm bench, 24 steps/min)' },
      { label: 'Rating', value: vo2 > 42 ? 'Good' : vo2 > 33 ? 'Average' : 'Below Average' },
    ]}
  }, description: 'Estimate aerobic fitness with the YMCA 3-minute step test using a 30 cm bench at 24 steps/min.', formula: 'VO2max estimated from post-exercise HR', interpretation: 'Lower post-test HR indicates better cardiovascular fitness.'
}

export default calcDef

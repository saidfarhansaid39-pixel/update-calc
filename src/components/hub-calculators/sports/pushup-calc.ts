import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({ count: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'), age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'), gender: z.string().optional() }),
  fields: [
    { name: 'count', label: 'Pushups Completed', type: 'number', min: 0, step: '1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2; const thr = isMale ? [15,25,35,45] : [5,12,20,30]
    const r = v.count >= thr[3] ? 'Excellent' : v.count >= thr[2] ? 'Good' : v.count >= thr[1] ? 'Average' : v.count >= thr[0] ? 'Below Average' : 'Poor'
    return { result: v.count, label: 'Pushup Score', unit: 'reps', steps: [
      { label: 'Pushups', value: ''+v.count }, { label: 'Rating', value: r },
      { label: 'Standards', value: isMale ? 'Exc:>45, Good:35-45, Avg:25-34' : 'Exc:>30, Good:20-29, Avg:12-19' },
    ]}
  }, description: 'Assess upper body endurance with the ACSM pushup test. Maximum consecutive pushups until failure.', formula: 'ACSM pushup test normative tables', interpretation: 'Pushup performance is a reliable indicator of upper body muscular endurance.'
}

export default calcDef

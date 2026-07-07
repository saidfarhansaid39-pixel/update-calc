import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({ count: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'), age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'), gender: z.string().optional() }),
  fields: [
    { name: 'count', label: 'Situps in 1 Minute', type: 'number', min: 0, step: '1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2; const thr = isMale ? [20,30,40,50] : [15,25,35,45]
    const r = v.count >= thr[3] ? 'Excellent' : v.count >= thr[2] ? 'Good' : v.count >= thr[1] ? 'Average' : v.count >= thr[0] ? 'Below Average' : 'Poor'
    return { result: v.count, label: 'Situp Score', unit: 'reps', steps: [
      { label: 'Situps in 1 min', value: ''+v.count }, { label: 'Rating', value: r },
      { label: 'Standards', value: isMale ? 'Exc:>50, Good:40-49, Avg:30-39' : 'Exc:>45, Good:35-44, Avg:25-34' },
    ]}
  }, description: 'Assess core muscular endurance with the 1-minute situp test. Used in military and law enforcement fitness assessments.', formula: 'Rating based on ACSM age/gender norms', interpretation: 'Higher situp counts indicate better core muscular endurance compared to normative data.'
}

export default calcDef

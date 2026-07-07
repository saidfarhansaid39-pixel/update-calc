import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({ reach: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120)), gender: z.string().optional() }),
  fields: [
    { name: 'reach', label: 'Sit-and-Reach Distance', type: 'number', unit: 'cm', min: -30, max: 50, step: '0.5' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2
    const thr = isMale ? [20, 25, 30, 35] : [25, 30, 35, 40]
    const r = v.reach >= thr[3] ? 'Excellent' : v.reach >= thr[2] ? 'Good' : v.reach >= thr[1] ? 'Average' : v.reach >= thr[0] ? 'Below Average' : 'Poor'
    return { result: v.reach, label: 'Sit-and-Reach Score', unit: 'cm', steps: [
      { label: 'Reach distance', value: v.reach+' cm' }, { label: 'Rating', value: r },
      { label: 'Standards', value: isMale ? 'Exc:>35cm, Good:30-35cm, Avg:25-29cm' : 'Exc:>40cm, Good:35-40cm, Avg:30-34cm' },
    ]}
  }, description: 'Assess hamstring and lower back flexibility with the sit-and-reach test. The standard flexibility assessment used in fitness testing batteries.', formula: 'Distance reached on sit-and-reach box (cm)', interpretation: 'Better flexibility reduces injury risk and improves movement quality. Consistent stretching improves sit-and-reach scores over time.'
}

export default calcDef

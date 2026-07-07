import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({ time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), gender: z.string().optional() }),
  fields: [
    { name: 'time', label: 'Illinois Agility Time', type: 'number', unit: 's', min: 10, step: '0.01' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2
    const r = isMale ? v.time < 15.2 ? 'Excellent' : v.time < 16.2 ? 'Good' : v.time < 17.0 ? 'Average' : 'Below Average'
      : v.time < 17.0 ? 'Excellent' : v.time < 18.0 ? 'Good' : v.time < 18.8 ? 'Average' : 'Below Average'
    return { result: v.time, label: 'Illinois Agility Time', unit: 's', steps: [
      { label: 'Time', value: v.time+' s' }, { label: 'Rating', value: r },
      { label: 'Description', value: 'Cone weave agility test measuring change-of-direction speed and body control' },
    ]}
  }, description: 'The Illinois Agility Test measures change-of-direction speed through a cone weaving course. Used by sports teams and athletic assessments.', formula: 'Time to complete Illinois cone weave course', interpretation: 'Faster times indicate superior agility, body control, and ability to change direction at speed.'
}

export default calcDef

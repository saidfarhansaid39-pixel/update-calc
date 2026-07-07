import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({ time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), gender: z.string().optional() }),
  fields: [
    { name: 'time', label: 'T-Test Time', type: 'number', unit: 's', min: 8, step: '0.01' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2
    const r = isMale ? v.time < 9.5 ? 'Excellent' : v.time < 10.5 ? 'Good' : v.time < 11.5 ? 'Average' : 'Below Average'
      : v.time < 10.5 ? 'Excellent' : v.time < 11.5 ? 'Good' : v.time < 12.5 ? 'Average' : 'Below Average'
    return { result: v.time, label: 'T-Test Time', unit: 's', steps: [
      { label: 'Time', value: v.time+' s' }, { label: 'Rating', value: r },
      { label: 'Description', value: 'Four-cone agility drill: forward sprint, lateral shuffles, backward run' },
    ]}
  }, description: 'The T-Test measures agility in four directions: forward sprint, lateral shuffle, and backward run. Used for assessing multidirectional movement.', formula: 'Time to complete T-shaped cone course', interpretation: 'Faster T-Test times indicate better multidirectional agility including deceleration and reacceleration.'
}

export default calcDef

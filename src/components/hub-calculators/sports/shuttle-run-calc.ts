import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({ time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), gender: z.string().optional() }),
  fields: [
    { name: 'time', label: 'Shuttle Run Time (4×10m)', type: 'number', unit: 's', min: 3, step: '0.01' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2
    const r = isMale ? v.time < 9 ? 'Excellent' : v.time < 10 ? 'Good' : v.time < 11 ? 'Average' : 'Below Average'
      : v.time < 10 ? 'Excellent' : v.time < 11 ? 'Good' : v.time < 12 ? 'Average' : 'Below Average'
    return { result: v.time, label: 'Shuttle Run', unit: 's', steps: [
      { label: 'Time', value: v.time+' s' }, { label: 'Rating', value: r },
      { label: 'Standards', value: isMale ? 'Exc:<9.0s, Good:9.0-9.9s, Avg:10.0-10.9s' : 'Exc:<10.0s, Good:10.0-10.9s, Avg:11.0-11.9s' },
    ]}
  }, description: 'Assess agility with the 4×10m shuttle run. Measures speed, acceleration, deceleration, and change-of-direction.', formula: 'Time to complete 4 × 10m course', interpretation: 'Faster times indicate better agility and change-of-direction ability.'
}

export default calcDef

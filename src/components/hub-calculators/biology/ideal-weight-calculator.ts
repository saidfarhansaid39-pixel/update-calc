import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    gender: z.string()
}),
  fields: [
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, step: '0.1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const hIn = v.height / 2.54
    const base60 = hIn - 60
    const isMale = v.gender === 'male'
    const devine = isMale ? 50 + 2.3 * base60 : 45.5 + 2.3 * base60
    const hamwi = isMale ? 48 + 2.7 * base60 : 45.5 + 2.2 * base60
    const robinson = isMale ? 52 + 1.9 * base60 : 49 + 1.7 * base60
    return {
      result: devine, label: 'Ideal Weight (Devine)', unit: 'kg',
      steps: [
        { label: 'Height', value: `${v.height} cm (${hIn.toFixed(0)} in)` },
        { label: 'Devine formula', value: `${devine.toFixed(1)} kg` },
        { label: 'Hamwi formula', value: `${hamwi.toFixed(1)} kg` },
        { label: 'Robinson formula', value: `${robinson.toFixed(1)} kg` },
        { label: 'Healthy BMI range', value: `${(18.5 * (v.height / 100) ** 2).toFixed(1)} – ${(24.9 * (v.height / 100) ** 2).toFixed(1)} kg` },
      ]
}
  },
  description: 'Ideal Body Weight (IBW) estimates a healthy weight for height using several validated formulas. Originally developed for medical dosing calculations.',
  formula: 'Devine: Male = 50 + 2.3(in–60) | Female = 45.5 + 2.3(in–60) | Hamwi/Robinson variations available.',
  interpretation: 'Ideal weight formulas were developed for medical dosing and may not reflect individual body composition differences. The healthy BMI range provides a broader weight target.'
}

export default calcDef

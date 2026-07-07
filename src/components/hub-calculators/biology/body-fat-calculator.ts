import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({
    neck: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    waist: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    gender: z.string(),
    hip: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'neck', label: 'Neck Circumference', type: 'number', unit: 'cm', min: 10, step: '0.1' },
    { name: 'waist', label: 'Waist Circumference', type: 'number', unit: 'cm', min: 20, step: '0.1' },
    { name: 'hip', label: 'Hip Circumference (female)', type: 'number', unit: 'cm', min: 20, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, step: '0.1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender === 'male'
    const logVals = Math.log10(v.waist + (isMale ? 0 : (v.hip || 0)) - v.neck)
    const bf = isMale ? 86.010 * logVals - 70.041 * Math.log10(v.height) + 36.76 : 163.205 * logVals - 97.684 * Math.log10(v.height) - 78.387
    const cat = isMale ? (bf < 6 ? 'Essential fat' : bf < 14 ? 'Athletes' : bf < 18 ? 'Fitness' : bf < 25 ? 'Acceptable' : 'Obese') : (bf < 14 ? 'Essential fat' : bf < 21 ? 'Athletes' : bf < 25 ? 'Fitness' : bf < 32 ? 'Acceptable' : 'Obese')
    return {
      result: bf, label: 'Body Fat', unit: '%',
      steps: [
        { label: 'Neck', value: `${v.neck} cm` },
        { label: 'Waist', value: `${v.waist} cm` },
        ...(!isMale ? [{ label: 'Hip', value: `${v.hip || 0} cm` }] : []),
        { label: 'Height', value: `${v.height} cm` },
        { label: 'Body fat (Navy method)', value: `${bf.toFixed(1)} %` },
        { label: 'Category', value: cat },
      ]
}
  },
  description: 'Estimate body fat percentage using the US Navy circumference method. This method uses neck, waist, and height (plus hip for females) to estimate body composition.',
  formula: 'Male: BF% = 86.01×log10(waist–neck) – 70.04×log10(height) + 36.76 | Female: uses hip circumference',
  interpretation: 'Essential fat: 2-5% (M) / 10-13% (F), Athletes: 6-13% (M) / 14-20% (F), Fitness: 14-17% (M) / 21-24% (F), Acceptable: 18-24% (M) / 25-31% (F), Obese: =25% (M) / =32% (F).'
}

export default calcDef

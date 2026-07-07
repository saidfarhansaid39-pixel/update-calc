import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({
    weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    gender: z.string()
}),
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 1, step: '0.1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const lbm = v.gender === 'male' ? 0.407 * v.weight + 0.267 * v.height - 19.2 : 0.252 * v.weight + 0.473 * v.height - 48.3
    return {
      result: lbm, label: 'Lean Body Mass (Boer)', unit: 'kg',
      steps: [
        { label: 'Weight', value: `${v.weight} kg` },
        { label: 'Height', value: `${v.height} cm` },
        { label: 'LBM (Boer)', value: `${lbm.toFixed(1)} kg` },
        { label: 'Body fat estimate', value: `${v.weight > 0 ? ((1 - lbm / v.weight) * 100).toFixed(1) : '—'} %` },
      ]
}
  },
  description: 'Lean Body Mass (LBM) is the weight of bones, organs, skin, and muscle minus body fat. The Boer formula provides a validated estimate from height, weight, and gender.',
  formula: 'Male: LBM = 0.407w + 0.267h – 19.2 | Female: LBM = 0.252w + 0.473h – 48.3',
  interpretation: 'LBM is typically 70–90% of total body weight. Higher LBM increases BMR and is associated with better metabolic health.'
}

export default calcDef

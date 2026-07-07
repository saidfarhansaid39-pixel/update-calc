import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'),
    exercise: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'exercise', label: 'Daily Exercise (optional)', type: 'number', unit: 'min', min: 0, step: '5' },
  ],
  compute: (v) => {
    const base = v.weight * 33
    const exerciseExtra = (v.exercise || 0) * 12
    const total = base + exerciseExtra
    return {
      result: total, label: 'Daily Water Intake', unit: 'mL',
      steps: [
        { label: 'Weight', value: `${v.weight} kg` },
        { label: 'Base needs (33 mL/kg)', value: `${base.toFixed(0)} mL` },
        ...(v.exercise ? [{ label: 'Exercise add (12 mL/min)', value: `${exerciseExtra} mL` }] : []),
        { label: 'Total daily water', value: `${total.toFixed(0)} mL (${(total / 1000).toFixed(1)} L)` },
        { label: '~In cups (240 mL)', value: `${(total / 240).toFixed(0)} cups` },
      ]
}
  },
  description: 'Daily water needs vary by weight, age, activity, and climate. Use this calculator to determine your optimal hydration target for health and performance.',
  formula: 'Daily Water (mL) = Weight(kg) × 33 + Exercise(min) × 12',
  interpretation: 'Adequate hydration supports metabolic function, temperature regulation, joint lubrication, and cognitive performance. Individual needs vary by climate and activity.'
}

export default calcDef

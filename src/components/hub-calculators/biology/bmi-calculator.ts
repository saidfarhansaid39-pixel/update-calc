import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const bmi = v.height > 0 ? v.weight / ((v.height / 100) ** 2) : 0
    const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    return {
      result: bmi, label: 'BMI', unit: 'kg/m²',
      steps: [
        { label: 'Weight', value: `${v.weight} kg` },
        { label: 'Height', value: `${v.height} cm` },
        { label: 'BMI', value: `${bmi.toFixed(1)} kg/m²` },
        { label: 'Category', value: cat },
      ]
}
  },
  description: 'Body Mass Index (BMI) is a measure of body fat based on weight and height. It is a screening tool for weight categories that may indicate health risks.',
  formula: 'BMI = weight(kg) / height(m)²',
  interpretation: 'Underweight < 18.5, Normal 18.5–24.9, Overweight 25–29.9, Obese = 30. BMI is a screening tool, not a diagnostic test.'
}

export default calcDef

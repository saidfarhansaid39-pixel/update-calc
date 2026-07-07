import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    activity: z.string(),
    goal: z.string()
}),
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.1' },
    { name: 'activity', label: 'Activity Level', type: 'select', options: [
      { label: 'Sedentary', value: '0.8' },
      { label: 'Moderate exercise', value: '1.2' },
      { label: 'Active / endurance', value: '1.6' },
      { label: 'Bodybuilding / strength', value: '2.0' },
      { label: 'Professional athlete', value: '2.2' },
    ] },
    { name: 'goal', label: 'Goal', type: 'select', options: [
      { label: 'Maintenance', value: 'maintain' },
      { label: 'Muscle gain', value: 'gain' },
      { label: 'Weight loss', value: 'loss' },
    ] },
  ],
  compute: (v) => {
    const factor = parseFloat(v.activity) || 0.8
    let goalMult = 1
    if (v.goal === 'gain') goalMult = 1.1
    else if (v.goal === 'loss') goalMult = 1.2
    const protein = v.weight * factor * goalMult
    return {
      result: protein, label: 'Daily Protein', unit: 'g',
      steps: [
        { label: 'Weight', value: `${v.weight} kg` },
        { label: 'Activity factor', value: `${factor} g/kg` },
        { label: 'Goal adjustment', value: `${goalMult}x` },
        { label: 'Daily protein', value: `${protein.toFixed(0)} g` },
        { label: 'Per meal (3 meals)', value: `${(protein / 3).toFixed(0)} g/meal` },
      ]
}
  },
  description: 'Protein needs vary by activity level and goals. Adequate protein intake supports muscle maintenance, growth, recovery, and metabolic health.',
  formula: 'Protein (g/day) = Weight(kg) × Activity Factor × Goal Factor | RDA: 0.8 g/kg | Active: 1.2-2.2 g/kg',
  interpretation: 'RDA: 0.8 g/kg (sedentary). Athletes: 1.2-2.2 g/kg. Spread intake across 3-5 meals for optimal muscle protein synthesis.'
}

export default calcDef

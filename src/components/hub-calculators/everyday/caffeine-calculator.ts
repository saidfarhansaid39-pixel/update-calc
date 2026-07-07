import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ servings: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), caffeinePerServing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bodyWeightCaf: z.string().min(1).refine(v => parseFloat(v) > 50, '>50') }),
  fields: [
    { name: 'servings', label: 'Servings Consumed', type: 'number', min: 1, step: '1' },
    { name: 'caffeinePerServing', label: 'Caffeine per Serving (mg)', type: 'number', min: 5, step: '10' },
    { name: 'bodyWeightCaf', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
  ],
  compute: (v) => {
    const totalMg = v.servings * v.caffeinePerServing
    const mgPerKg = totalMg / (v.bodyWeightCaf / 2.205)
    const safe = mgPerKg <= 400
    return { result: totalMg, label: 'Total Caffeine', unit: 'mg', steps: [{ label: 'Total Intake', value: `${totalMg} mg` }, { label: 'Per kg Body Weight', value: `${mgPerKg.toFixed(1)} mg/kg` }, { label: 'Status', value: safe ? 'Within safe range' : 'Exceeds 400 mg/day limit' }] }
  },
  description: 'Track your daily caffeine intake compared to recommended limits. Enter servings, caffeine per serving, and body weight to assess safety.',
  formula: 'Total = Servings × mg/Serving | mg/kg = Total / (Weight(lbs)/2.205)',
  interpretation: 'FDA recommends ≤400 mg/day (∼4 cups coffee) for healthy adults. Single dose >200 mg or >10 mg/kg can cause anxiety. Half-life: 3-5 hours. Avoid after 2 PM for better sleep.'
}

export default calcDef

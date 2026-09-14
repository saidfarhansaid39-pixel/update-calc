import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ steps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightInches: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'steps', label: 'Number of Steps', type: 'number', min: 1, step: '100' },
    { name: 'heightInches', label: 'Your Height (in)', type: 'number', min: 36, max: 96, step: '1' },
  ],
  defaults: { steps: '10000', heightInches: '68' },
  presets: [
    { label: '10K Daily Target', values: { steps: '10000', heightInches: '68' } },
    { label: 'Sedentary Baseline', values: { steps: '4000', heightInches: '68' } },
    { label: 'Active Day Out', values: { steps: '15000', heightInches: '65' } },
    { label: 'Casual Stroll', values: { steps: '5000', heightInches: '72' } },
  ],
  compute: (v) => {
    const strideFt = v.heightInches * 0.415 / 12
    const miles = v.steps * strideFt / 5280
    const km = miles * 1.60934
    return { result: miles, label: 'Distance', unit: 'mi', steps: [{ label: 'Steps', value: `${v.steps}` }, { label: 'Stride', value: `${(strideFt * 12).toFixed(1)} in` }, { label: 'Distance (mi)', value: `${miles.toFixed(2)} mi` }, { label: 'Distance (km)', value: `${km.toFixed(2)} km` }] ,
    extras: [
      { label: '10,000 Steps Origin', value: 'The 10K/day target was a 1960s Japanese marketing campaign for a pedometer. Modern research suggests 7,000-8,000 steps is sufficient for health' },
      { label: 'Stride Length Science', value: 'Stride ≈ height × 0.415 (walking) or height × 0.45-0.50 (running). Men average 30 in, women 26 in. Faster walking lengthens stride' },
      { label: 'Health Benchmarks', value: 'Sedentary: <5,000 steps/day. Low active: 5,000-7,499. Somewhat active: 7,500-9,999. Active: 10,000-12,499. Highly active: ≥12,500' },
      { label: 'Calorie Burn Context', value: 'Walking 1 mile burns ~80-100 calories for a 150-lb person. At 10,000 steps (~5 miles), that\'s 400-500 kcal — equivalent to a meal' },
      { label: 'Pacing Matters', value: 'Brisk walking (3-4 mph) burns 30% more calories per mile than casual strolling (2 mph). 2,000 steps at brisk pace ≈ 1 mile' },
      { label: 'Incline Bonus', value: 'Walking uphill at 5% grade doubles calorie burn per mile. Each 1% incline adds ~10% more energy expenditure' },
      { label: 'Age Adjustment', value: 'Stride length decreases ~0.5% per year after age 40. Adjust your height-based stride calculation accordingly for more accuracy' },
    ]}
  },
  description: 'Convert steps to miles using your height to estimate stride length. Stride is calculated as 41.5% of height — the standard formula for walking gait.',
  formula: 'Stride(ft) = Height(in) × 0.415 ÷ 12. Miles = Steps × Stride(ft) ÷ 5,280. Kilometers = Miles × 1.60934.',
  interpretation: 'For a person of average height (5\'8"), 2,000 steps ≈ 1 mile and 10,000 steps ≈ 5 miles. The 10,000-step target burns ~400-500 kcal/day for a 150-lb person. However, Harvard research shows 7,500 steps/day is sufficient for significant health benefits — mortality risk decreases 50-70% going from 4,000 to 7,500 steps. Pacing matters for exercise benefit: 3,000 steps at a brisk pace provides more cardiovascular benefit than 5,000 casual steps. Walking is the most accessible form of exercise with the lowest injury rate.'
}

export default calcDef

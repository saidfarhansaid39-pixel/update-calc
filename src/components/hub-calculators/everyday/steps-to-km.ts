import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ steps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightCm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'steps', label: 'Number of Steps', type: 'number', min: 1, step: '100' },
    { name: 'heightCm', label: 'Your Height (cm)', type: 'number', min: 100, max: 250, step: '1' },
  ],
  defaults: { steps: '10000', heightCm: '173' },
  presets: [
    { label: '10K Daily Target', values: { steps: '10000', heightCm: '173' } },
    { label: 'Weekend Hike', values: { steps: '20000', heightCm: '175' } },
    { label: 'Office Worker', values: { steps: '5000', heightCm: '165' } },
    { label: 'Active Commute', values: { steps: '12000', heightCm: '180' } },
  ],
  compute: (v) => {
    const strideM = v.heightCm * 0.415 / 100
    const distanceKm = v.steps * strideM / 1000
    const calories = v.steps * 0.04
    return { result: distanceKm, label: 'Distance', unit: 'km', steps: [{ label: 'Steps', value: `${v.steps}` }, { label: 'Stride Length', value: `${(strideM * 100).toFixed(1)} cm` }, { label: 'Distance', value: `${distanceKm.toFixed(2)} km` }, { label: 'Calories Burned', value: `~${calories.toFixed(0)} kcal` }] ,
    extras: [
      { label: 'Metric Daily Target', value: '7,000-8,000 steps/day (5-6 km) is the evidence-based health target per recent studies — not the 10K marketing myth' },
      { label: 'Stride Calculation', value: 'Walking stride ≈ height × 0.415. Running stride ≈ height × 0.45-0.50. A 175 cm person has a 72.6 cm (0.726 m) walking stride' },
      { label: 'Health Benchmarks (Metric)', value: 'Sedentary: <3.5 km/day. Low active: 3.5-5 km. Somewhat active: 5-7 km. Active: 7-9 km. Highly active: >9 km/day' },
      { label: 'Walking Speed & Calories', value: 'Brisk walking (5-6 km/h) burns 30% more per km than strolling (3 km/h). A 70 kg person burns ~0.5 kcal per kg per km walked' },
      { label: 'Daily Step Trends', value: 'Average Canadian: 8,500 steps/day. UK: 7,200. Japan: 7,200. Australia: 9,600. Switzerland: 9,800. US: 6,300 (lowest studied)' },
      { label: 'Health Impact Per 1,000 Steps', value: 'Each additional 1,000 steps/day reduces all-cause mortality risk by 12-15%. Benefits plateau around 10,000 steps/day' },
      { label: 'Walking vs Running', value: 'Walking 1 km burns approximately the same calories as running 1 km (~0.8 kcal/kg/km). Running takes less time but has higher impact' },
    ]}
  },
  description: 'Convert steps to kilometers based on your height. Uses the standard walking stride formula (stride = height × 0.415) for accurate distance measurement.',
  formula: 'Stride(m) = Height(cm) × 0.415 ÷ 100. Distance(km) = Steps × Stride(m) ÷ 1,000. Calories ~ Steps × 0.04 (estimate for average adult).',
  interpretation: 'For a person of average height (173 cm / 5\'8"), 10,000 steps ≈ 7.2 km and 1 km ≈ 1,400 steps. The widely promoted 10,000-step target originated from a 1960s Japanese marketing campaign, not science. Modern research from Harvard (2023) shows 7,000-8,000 steps (5-6 km) daily provides 50-75% of maximum mortality risk reduction. Each additional 1,000 steps/day reduces all-cause mortality by ~12%. Walking 30 minutes at 5-6 km/h adds approximately 4,000 steps.'
}

export default calcDef

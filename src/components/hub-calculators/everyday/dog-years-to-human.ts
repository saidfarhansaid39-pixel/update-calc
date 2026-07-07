import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dogAge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), breedSize: z.string().min(1) }),
  fields: [
    { name: 'dogAge', label: 'Dog Age (years)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'breedSize', label: 'Breed Size', type: 'select', options: [{ label: 'Small (<20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (51-100 lbs)', value: 'large' }, { label: 'Giant (>100 lbs)', value: 'giant' }] },
  ],
  compute: (v) => {
    const age = v.dogAge
    const sizeFactors: Record<string, number> = { small: 0.5, medium: 0.65, large: 0.8, giant: 1.0 }
    const sizeFactor = sizeFactors[v.breedSize] || 0.65
    const humanYears = 16 * Math.log(age + 1) + 31 - sizeFactor * 5
    return { result: humanYears, label: 'Human Years', unit: '', steps: [{ label: 'Dog Age', value: `${age} years` }, { label: 'Breed Size', value: `${v.breedSize}` }, { label: 'Human Equivalent', value: `${humanYears.toFixed(1)} years` }] }
  },
  description: 'Convert dog age to human years using the modern logarithmic formula that accounts for breed size. More accurate than the old 7:1 rule.',
  formula: 'Human Years = 16 × ln(Dog Age + 1) + 31 - breed adjustment',
  interpretation: 'The old "1 dog year = 7 human years" is outdated. Dogs age faster in early years (1 dog year ≈ 31 human years for all breeds) and slow down. Small breeds age slower and live longer.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ petType: z.enum(['dog', 'cat']), petAge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), size: z.enum(['small', 'medium', 'large']) }),
  fields: [
    { name: 'petType', label: 'Pet Type', type: 'select', options: [{ label: 'Dog', value: 'dog' }, { label: 'Cat', value: 'cat' }] },
    { name: 'petAge', label: 'Pet Age (years)', type: 'number', min: 0, step: '1' },
    { name: 'size', label: 'Size (dogs only)', type: 'select', options: [{ label: 'Small (<20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (>50 lbs)', value: 'large' }] },
  ],
  compute: (v) => { let humanYears; if (v.petType === 'cat') { if (v.petAge <= 1) humanYears = 15; else if (v.petAge <= 2) humanYears = 24; else humanYears = 24 + (v.petAge - 2) * 4 } else { if (v.petAge <= 1) humanYears = 15; else if (v.petAge <= 2) humanYears = 24; else { const mult = v.size === 'small' ? 4 : v.size === 'medium' ? 5 : 6; humanYears = 24 + (v.petAge - 2) * mult } } return { result: humanYears, label: 'Human Years Equivalent', unit: 'years', steps: [{ label: 'Pet Age', value: `${v.petAge} ${v.petType} years` }, { label: 'Human Years', value: `${humanYears.toFixed(0)} human years` }, { label: 'Life Stage', value: humanYears < 24 ? 'Adolescent/Young Adult' : humanYears < 48 ? 'Adult' : humanYears < 64 ? 'Senior' : 'Geriatric' }] } },
  description: 'Convert your pet\'s age to human equivalent years using breed-size-adjusted formulas for dogs and cats.',
  formula: 'Year 1 = 15, Year 2 = +9 (=24), Then: Dogs: +4-6/yr, Cats: +4/yr | Human Age = 24 + (Pet Age − 2) × Factor',
  interpretation: 'Cats and small dogs age slower than large dogs after age 2. Regular vet visits become more important for pets over 7 (human 44-50 equivalent). Senior pet care starts around 50-60 human years.'
}

export default calcDef

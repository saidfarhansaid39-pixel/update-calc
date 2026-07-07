import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ humanAge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dogSize: z.enum(['small', 'medium', 'large']) }),
  fields: [
    { name: 'humanAge', label: 'Human Age (years)', type: 'number', min: 0, step: '1' },
    { name: 'dogSize', label: 'Dog Size', type: 'select', options: [{ label: 'Small (<20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (>50 lbs)', value: 'large' }] },
  ],
  compute: (v) => { const human = v.humanAge; let dogYears; if (human <= 1) { dogYears = human * 15 } else if (human <= 2) { dogYears = 15 + (human - 1) * 9 } else { const base = human > 2 ? human - 2 : 0; const mult = v.dogSize === 'small' ? 4 : v.dogSize === 'medium' ? 5 : 6; dogYears = 24 + base * mult } return { result: dogYears, label: 'Dog Age', unit: 'dog years', steps: [{ label: 'First Year', value: '15 dog years' }, { label: 'Second Year', value: '+9 dog years = 24' }, { label: 'Remaining Years', value: `${Math.max(0, human - 2)} × ${v.dogSize === 'small' ? 4 : v.dogSize === 'medium' ? 5 : 6}` }, { label: 'Total', value: `${dogYears.toFixed(0)} dog years` }] } },
  description: 'Convert human age to dog years using the modern scientific method that accounts for dog size and breed.',
  formula: 'Dog Years = 15 (year 1) + 9 (year 2) + (Human Age − 2) × Size Factor (4-6 per year)',
  interpretation: 'The old "1 dog year = 7 human years" is outdated. The first year equals ~15 dog years. Smaller breeds age slower than larger breeds after age 2.'
}

export default calcDef

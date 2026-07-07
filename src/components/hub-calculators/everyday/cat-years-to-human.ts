import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ catAge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'catAge', label: 'Cat Age (years)', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const catYrs = v.catAge
    const humanYrs = catYrs <= 1 ? 15 : catYrs <= 2 ? 24 : 24 + (catYrs - 2) * 4
    const lifeStage = catYrs <= 1 ? 'Kitten' : catYrs <= 6 ? 'Adult' : catYrs <= 11 ? 'Senior' : 'Geriatric'
    return { result: humanYrs, label: 'Human Age Equivalent', unit: 'years', steps: [{ label: 'Cat Age', value: `${catYrs} cat years` }, { label: 'Human Equivalent', value: `${humanYrs} human years` }, { label: 'Life Stage', value: lifeStage }] }
  },
  description: 'Convert cat years to human years. The first year equals ~15 human years, year two adds ~9 more, and each subsequent year adds ~4 human years.',
  formula: 'Human Years = 15 (yr 1) or 24 (yr 2) or 24 + (Age - 2) × 4 (yr 3+)',
  interpretation: 'Indoor cats live 12-18 years on average. A 15-year-old cat is ~76 in human years. Regular vet checkups, proper diet, and exercise can extend lifespan by 2-5 years.'
}

export default calcDef

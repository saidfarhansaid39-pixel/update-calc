import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    births: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    population: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    females: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'births', label: 'Live Births', type: 'number', min: 0, step: '1' },
    { name: 'population', label: 'Total Population', type: 'number', min: 1, step: '1' },
    { name: 'females', label: 'Females (for fecundity)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const crudeRate = v.births / v.population * 1000
    const fecundity = v.females && v.females > 0 ? v.births / v.females : 0
    return {
      result: crudeRate, label: 'Crude Birth Rate', unit: 'per 1000',
      steps: [
        { label: 'Births', value: `${v.births}` },
        { label: 'Population', value: `${v.population}` },
        { label: 'Crude birth rate', value: `${crudeRate.toFixed(2)}/1000` },
        ...(v.females && v.females > 0 ? [
          { label: 'Fecundity (births/female)', value: `${fecundity.toFixed(2)}` },
        ] : []),
      ]
}
  },
  description: 'Birth rate measures reproductive output in a population. The crude birth rate is births per 1,000 individuals per year, while fecundity is births per female.',
  formula: 'CBR = (Births / Population) × 1000 | Fecundity = Births / Number of females',
  interpretation: 'Global human CBR: ~18/1000. Developed: 8-12/1000. Developing: 20-40/1000. Replacement level: ~2.1 births per female. Fecundity varies widely in wildlife.'
}

export default calcDef

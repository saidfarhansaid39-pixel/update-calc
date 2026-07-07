import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    immigrants: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    emigrants: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    population: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'immigrants', label: 'Immigrants (arriving)', type: 'number', min: 0, step: '1' },
    { name: 'emigrants', label: 'Emigrants (leaving)', type: 'number', min: 0, step: '1' },
    { name: 'population', label: 'Total Population', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const netMig = (v.immigrants - v.emigrants) / v.population * 1000
    const grossMig = (v.immigrants + v.emigrants) / v.population * 1000
    const immigrationRate = v.immigrants / v.population * 1000
    const emigrationRate = v.emigrants / v.population * 1000
    return {
      result: netMig, label: 'Net Migration Rate', unit: 'per 1000',
      steps: [
        { label: 'Immigrants', value: `${v.immigrants}` },
        { label: 'Emigrants', value: `${v.emigrants}` },
        { label: 'Immigration rate', value: `${immigrationRate.toFixed(2)}/1000` },
        { label: 'Emigration rate', value: `${emigrationRate.toFixed(2)}/1000` },
        { label: 'Net migration rate', value: `${netMig.toFixed(2)}/1000` },
        { label: 'Gross migration rate', value: `${grossMig.toFixed(2)}/1000` },
      ]
}
  },
  description: 'Migration rates measure population movement. Net migration = immigrants minus emigrants. Positive net migration adds to population growth; negative reduces it.',
  formula: 'Net Migration Rate = (I - E) / N × 1000 | Gross Migration Rate = (I + E) / N × 1000',
  interpretation: 'Migration is a key component of population change alongside births and deaths. Metapopulation dynamics depend on dispersal between habitat patches.'
}

export default calcDef

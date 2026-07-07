import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    deaths: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    population: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    years: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'deaths', label: 'Number of Deaths', type: 'number', min: 0, step: '1' },
    { name: 'population', label: 'Total Population', type: 'number', min: 1, step: '1' },
    { name: 'years', label: 'Time Period (years)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const years = v.years || 1
    const crudeRate = v.deaths / v.population * 1000 / years
    const survival = v.population > v.deaths ? (1 - v.deaths / v.population / years) : 0
    return {
      result: crudeRate, label: 'Crude Mortality Rate', unit: 'per 1000/yr',
      steps: [
        { label: 'Deaths', value: `${v.deaths}` },
        { label: 'Population', value: `${v.population}` },
        { label: 'Time period', value: `${years} yr` },
        { label: 'Mortality rate', value: `${crudeRate.toFixed(2)}/1000/yr` },
        { label: 'Annual survival rate', value: `${(survival * 100).toFixed(2)}%` },
      ]
}
  },
  description: 'Mortality rate is the number of deaths per 1,000 individuals per year in a population. It is a fundamental demographic parameter in ecology and life tables.',
  formula: 'Mortality Rate = (Deaths / Population) × 1000 / years | Survival = 1 – Deaths/Population',
  interpretation: 'Global human mortality: ~8/1000/yr. Wildlife mortality varies: 30-80% for juveniles, 5-20% for adults. Life tables summarize age-specific mortality.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]}
  },
  description: 'Mortality rate is the number of deaths per 1,000 individuals per year in a population. It is a fundamental demographic parameter in ecology and life tables.',
  formula: 'Mortality Rate = (Deaths / Population) × 1000 / years | Survival = 1 – Deaths/Population',
  interpretation: 'Global human mortality: ~8/1000/yr. Wildlife mortality varies: 30-80% for juveniles, 5-20% for adults. Life tables summarize age-specific mortality.'
}

export default calcDef

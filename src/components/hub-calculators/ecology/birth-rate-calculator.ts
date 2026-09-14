import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]}
  },
  description: 'Birth rate measures reproductive output in a population. The crude birth rate is births per 1,000 individuals per year, while fecundity is births per female.',
  formula: 'CBR = (Births / Population) × 1000 | Fecundity = Births / Number of females',
  interpretation: 'Global human CBR: ~18/1000. Developed: 8-12/1000. Developing: 20-40/1000. Replacement level: ~2.1 births per female. Fecundity varies widely in wildlife.'
}

export default calcDef

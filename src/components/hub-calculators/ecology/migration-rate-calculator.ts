import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]}
  },
  description: 'Migration rates measure population movement. Net migration = immigrants minus emigrants. Positive net migration adds to population growth; negative reduces it.',
  formula: 'Net Migration Rate = (I - E) / N × 1000 | Gross Migration Rate = (I + E) / N × 1000',
  interpretation: 'Migration is a key component of population change alongside births and deaths. Metapopulation dynamics depend on dispersal between habitat patches.'
}

export default calcDef

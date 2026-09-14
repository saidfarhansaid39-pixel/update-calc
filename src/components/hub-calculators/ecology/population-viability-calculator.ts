import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    n0: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    growthRate: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > -1 && n < 1 }, '-1 to 1'),
    years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    minViable: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'n0', label: 'Current Population', type: 'number', min: 1, step: '1' },
    { name: 'growthRate', label: 'Growth Rate (r, decimal)', type: 'number', min: -0.99, max: 0.99, step: '0.01' },
    { name: 'years', label: 'Time Horizon', type: 'number', unit: 'years', min: 1, step: '1' },
    { name: 'minViable', label: 'Minimum Viable Pop. (MVP)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
    ],
  compute: (v) => {
    const nFinal = v.n0 * Math.exp(v.growthRate * v.years)
    const mvp = v.minViable || 50
    const quasiExtinct = nFinal < mvp
    const prob = quasiExtinct ? 1 - (nFinal / v.n0) : 0
    return {
      result: nFinal, label: 'Projected Population', unit: '',
      steps: [
        { label: 'Current N', value: `${v.n0}` },
        { label: 'Growth rate r', value: `${v.growthRate}` },
        { label: 'Time horizon', value: `${v.years} yr` },
        { label: 'Projected N(t)', value: `${nFinal.toFixed(0)}` },
        { label: 'MVP threshold', value: `${mvp}` },
        { label: 'Status', value: quasiExtinct ? 'Likely extinct' : (nFinal / v.n0 > 1.5 ? 'Increasing' : 'Stable/declining') },
        { label: 'Extinction concern', value: quasiExtinct ? 'HIGH — population below MVP' : 'LOW — above MVP' },
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
  description: 'Population Viability Analysis (PVA) projects future population size and extinction risk. Minimum Viable Population (MVP) is the threshold for long-term survival.',
  formula: 'N(t) = N₀ × e^(rt) | Extinction risk when N(t) < MVP | Typical MVP: 50-500 individuals',
  interpretation: 'MVP of 50 for short-term survival, 500 for long-term viability. Small populations face inbreeding depression, genetic drift, and Allee effects.'
}

export default calcDef

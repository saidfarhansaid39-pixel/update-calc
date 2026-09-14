import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ ne: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), inbreeding: z.string().optional() }),
  fields: [
    { name: 'ne', label: 'Effective population size (Ne)', type: 'number', min: 1, step: '1' },
    { name: 'inbreeding', label: 'Inbreeding coefficient (F, optional)', type: 'number', min: 0, max: 1, step: '0.01' },
    ],
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
    ],
  compute: (v) => { const Ne = parseInt(v.ne); const NeOverN = 0.35; const Nc = Ne/NeOverN; const mvp50 = 50; const mvp500 = 500; const status = Ne<50?'Critically endangered':Ne<250?'Endangered':Ne<500?'Vulnerable':'Low risk'; return { result: Nc, label: 'Census Population (Nc)', unit: '', steps: [{ label: 'Effective size Ne', value: `${Ne}` }, { label: 'Estimated census Nc (Ne/0.35)', value: `${Math.round(Nc)}` }, { label: 'MVP short-term (50)', value: `${mvp50}` }, { label: 'MVP long-term (500)', value: `${mvp500}` }, { label: 'Conservation status', value: status }] ,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]} },
  description: 'Minimum Viable Population (MVP) is the smallest isolated population with a high probability (typically 99%) of persisting for a given time.',
  formula: 'Ne/N ≈ 0.35 typical | MVP: 50 for short-term, 500 for long-term | Franklin 1980',
  interpretation: 'MVP of 50 prevents inbreeding depression (short-term). MVP of 500 maintains genetic diversity (long-term). Larger MVPs for fluctuating environments.'
}

export default calcDef

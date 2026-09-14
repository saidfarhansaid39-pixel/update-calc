import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ births: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), deaths: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), pop: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().optional() }),
  fields: [
    { name: 'pop', label: 'Initial population (N₀)', type: 'number', min: 1, step: '1' },
    { name: 'births', label: 'Births per 1000 per year', type: 'number', min: 0, step: '1' },
    { name: 'deaths', label: 'Deaths per 1000 per year', type: 'number', min: 0, step: '1' },
    { name: 'time', label: 'Time (years)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
    ],
  compute: (v) => { const N0 = parseFloat(v.pop); const b = parseFloat(v.births)/1000; const d = parseFloat(v.deaths)/1000; const t = parseInt(v.time)||10; const r = b-d; const Nt = N0 * Math.exp(r*t); const doubling = r>0?Math.log(2)/r:Infinity; return { result: Nt, label: 'Population at time t (Nₜ)', unit: '', steps: [{ label: 'Initial N₀', value: `${N0}` }, { label: 'Birth rate (b)', value: `${b}` }, { label: 'Death rate (d)', value: `${d}` }, { label: 'r = b - d', value: r.toFixed(4) }, { label: 'Nₜ = N₀·e^(rt)', value: Nt.toFixed(0) }, { label: 'Doubling time', value: doubling===Infinity?'N/A':`${doubling.toFixed(1)} yrs` }] ,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]} },
  description: 'Lotka\'s exponential growth model: Nₜ = N₀e^(rt) calculates population size at time t given intrinsic growth rate r.',
  formula: 'Nₜ = N₀·e^(rt) | r = b - d | t_d = ln(2)/r',
  interpretation: 'Positive r = exponential growth. Negative r = exponential decline. In nature, limits (carrying capacity) eventually slow growth.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ births: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), deaths: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), pop: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().optional() }),
  fields: [
    { name: 'pop', label: 'Initial population (N₀)', type: 'number', min: 1, step: '1' },
    { name: 'births', label: 'Births per 1000 per year', type: 'number', min: 0, step: '1' },
    { name: 'deaths', label: 'Deaths per 1000 per year', type: 'number', min: 0, step: '1' },
    { name: 'time', label: 'Time (years)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const N0 = parseFloat(v.pop); const b = parseFloat(v.births)/1000; const d = parseFloat(v.deaths)/1000; const t = parseInt(v.time)||10; const r = b-d; const Nt = N0 * Math.exp(r*t); const doubling = r>0?Math.log(2)/r:Infinity; return { result: Nt, label: 'Population at time t (Nₜ)', unit: '', steps: [{ label: 'Initial N₀', value: `${N0}` }, { label: 'Birth rate (b)', value: `${b}` }, { label: 'Death rate (d)', value: `${d}` }, { label: 'r = b - d', value: r.toFixed(4) }, { label: 'Nₜ = N₀·e^(rt)', value: Nt.toFixed(0) }, { label: 'Doubling time', value: doubling===Infinity?'N/A':`${doubling.toFixed(1)} yrs` }] } },
  description: 'Lotka\'s exponential growth model: Nₜ = N₀e^(rt) calculates population size at time t given intrinsic growth rate r.',
  formula: 'Nₜ = N₀·e^(rt) | r = b - d | t_d = ln(2)/r',
  interpretation: 'Positive r = exponential growth. Negative r = exponential decline. In nature, limits (carrying capacity) eventually slow growth.'
}

export default calcDef

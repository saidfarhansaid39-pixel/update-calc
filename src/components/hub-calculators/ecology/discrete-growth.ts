import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n0: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lambda: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), steps: z.string().optional() }),
  fields: [
    { name: 'n0', label: 'Initial population (N₀)', type: 'number', min: 1, step: '1' },
    { name: 'lambda', label: 'Geometric growth factor (λ)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'steps', label: 'Number of time steps', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const N0 = parseFloat(v.n0); const lambda = parseFloat(v.lambda); const t = parseInt(v.steps)||10; const Nt = N0 * Math.pow(lambda, t); const r = Math.log(lambda); const doubling = r>0?Math.LN2/r:Infinity; return { result: Nt, label: 'N after t steps', unit: '', steps: [{ label: 'Initial N₀', value: `${N0}` }, { label: 'λ (geometric factor)', value: lambda.toFixed(3) }, { label: 'r = ln(λ)', value: r.toFixed(4) }, { label: 'Time steps', value: `${t}` }, { label: 'Nₜ = N₀ × λᵗ', value: Nt.toFixed(0) }, { label: 'Doubling steps', value: doubling===Infinity?'N/A':`${doubling.toFixed(1)}` }] } },
  description: 'Discrete population growth models populations with non-overlapping generations using Nₜ = N₀ × λᵗ, where λ is the geometric growth factor.',
  formula: 'Nₜ = N₀ × λᵗ | r = ln(λ) | λ > 1 growing, λ = 1 stable, λ < 1 declining',
  interpretation: 'λ is the per capita multiplicative growth rate per time step. λ = 1.1 means 10% growth per step. Halving time when λ < 1.'
}

export default calcDef

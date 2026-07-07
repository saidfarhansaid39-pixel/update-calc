import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

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
}
  },
  description: 'Population Viability Analysis (PVA) projects future population size and extinction risk. Minimum Viable Population (MVP) is the threshold for long-term survival.',
  formula: 'N(t) = N₀ × e^(rt) | Extinction risk when N(t) < MVP | Typical MVP: 50-500 individuals',
  interpretation: 'MVP of 50 for short-term survival, 500 for long-term viability. Small populations face inbreeding depression, genetic drift, and Allee effects.'
}

export default calcDef

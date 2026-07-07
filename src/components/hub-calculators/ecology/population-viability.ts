import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n0: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), growthRate: z.string().min(1).refine(v => { const n = parseFloat(v); return n > -1 && n < 1 }, '-1 to 1'), years: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), minViable: z.string().optional() }),
  fields: [
    { name: 'n0', label: 'Current population size', type: 'number', min: 1, step: '1' },
    { name: 'growthRate', label: 'Growth rate (r, decimal)', type: 'number', min: -0.99, max: 0.99, step: '0.01' },
    { name: 'years', label: 'Time horizon (years)', type: 'number', min: 1, step: '1' },
    { name: 'minViable', label: 'MVP threshold (optional)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const nFinal = parseFloat(v.n0) * Math.exp(parseFloat(v.growthRate) * parseInt(v.years)); const mvp = parseInt(v.minViable)||50; const quasiExtinct = nFinal < mvp; return { result: nFinal, label: 'Projected Population', unit: '', steps: [{ label: 'Current N', value: `${v.n0}` }, { label: 'Growth rate r', value: `${v.growthRate}` }, { label: 'Time horizon', value: `${v.years} yr` }, { label: 'Projected N(t)', value: nFinal.toFixed(0) }, { label: 'MVP threshold', value: `${mvp}` }, { label: 'Status', value: quasiExtinct?'Below MVP — high risk':'Above MVP — low risk' }] } },
  description: 'Population Viability Analysis (PVA) projects future population size and extinction risk using exponential growth model.',
  formula: 'N(t) = N₀ × e^(rt) | Extinction risk when N(t) < MVP',
  interpretation: 'MVP of 50 for short-term survival, 500 for long-term viability. Small populations face inbreeding depression, genetic drift, and Allee effects.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ observed: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'observed', label: 'Species observed', type: 'number', min: 1, step: '1' },
    { name: 'area', label: 'Sampling area (km²)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => { const s = parseInt(v.observed); const a = parseFloat(v.area); const density = s / a; const logS = Math.log(s); const logA = Math.log(a); return { result: s, label: 'Species Richness (S)', unit: '', steps: [{ label: 'Observed species (S)', value: `${s}` }, { label: 'Area sampled', value: `${a} km²` }, { label: 'Species density', value: `${density.toFixed(4)} species/km²` }, { label: 'Log(S)', value: `${logS.toFixed(3)}` }, { label: 'Log(area)', value: `${logA.toFixed(3)}` }] } },
  description: 'Calculates species richness and density, foundational metrics for biodiversity assessment.',
  formula: 'S = number of species | Density = S / Area',
  interpretation: 'Species richness increases with area (species-area relationship). Compare only across equal sampling effort.'
}

export default calcDef

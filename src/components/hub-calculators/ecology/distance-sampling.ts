import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ nObs: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), transectLen: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), detectDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'nObs', label: 'Number of observations', type: 'number', min: 1, step: '1' },
    { name: 'transectLen', label: 'Total transect length (m)', type: 'number', min: 1, step: '1' },
    { name: 'detectDist', label: 'Maximum detection distance (m)', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => { const n = parseInt(v.nObs); const L = parseFloat(v.transectLen); const w = parseFloat(v.detectDist); const area = 2 * L * w / 10000; const density = area>0?n/area:0; return { result: density, label: 'Population Density', unit: 'ind/ha', steps: [{ label: 'Observations (n)', value: `${n}` }, { label: 'Transect length', value: `${L} m` }, { label: 'Half-width (w)', value: `${w} m` }, { label: 'Area sampled', value: `${area.toFixed(2)} ha` }, { label: 'Density estimate', value: `${density.toFixed(2)} ind/ha` }] } },
  description: 'Distance sampling estimates population density from line transect surveys, assuming detection decreases with distance from the transect.',
  formula: 'D = n / (2 × L × w × ê) | Area = 2 × L × w | Detectability adjustment needed',
  interpretation: 'Assumes all objects on the transect line are detected. Detection function g(x) models decreasing detectability with distance. Cluster size adjustment needed for groups.'
}

export default calcDef

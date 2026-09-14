import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ nObs: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), transectLen: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), detectDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'nObs', label: 'Number of observations', type: 'number', min: 1, step: '1' },
    { name: 'transectLen', label: 'Total transect length (m)', type: 'number', min: 1, step: '1' },
    { name: 'detectDist', label: 'Maximum detection distance (m)', type: 'number', min: 0.1, step: '1' },
    ],
  presets: [
    { label: 'Small mammal trapping', values: { marked: '40', recaptured: '35', markedInRecapture: '28' } },
    { label: 'Butterfly transect', values: { transectLength: '500', width: '5', observed: '120' } },
    { label: 'Forest tree quadrat', values: { quadratSize: '400', count: '15', totalArea: '10000' } },
    { label: 'Fish removal method', values: { catchDay1: '50', catchDay2: '35', catchDay3: '22' } },
    { label: 'Bird point count', values: { radius: '50', count: '8', surveys: '4' } }
    ],
  compute: (v) => { const n = parseInt(v.nObs); const L = parseFloat(v.transectLen); const w = parseFloat(v.detectDist); const area = 2 * L * w / 10000; const density = area>0?n/area:0; return { result: density, label: 'Population Density', unit: 'ind/ha', steps: [{ label: 'Observations (n)', value: `${n}` }, { label: 'Transect length', value: `${L} m` }, { label: 'Half-width (w)', value: `${w} m` }, { label: 'Area sampled', value: `${area.toFixed(2)} ha` }, { label: 'Density estimate', value: `${density.toFixed(2)} ind/ha` }] ,
    extras: [
      { label: "Environmental Context", value: "Accurate population estimation is critical for wildlife management, harvest quotas, and endangered species monitoring." },
      { label: "Measurement Method", value: "Field protocols include random/stratified quadrats, line transects (distance sampling), capture-mark-recapture, and removal methods." },
      { label: "Conservation Note", value: "Population estimates inform IUCN Red List assessments, CITES quotas, and management decisions. CV < 20% is typically required for reliable estimates." },
      { label: "Typical Ranges", value: "Detection probability: 0.1-0.9. Optimal quadrat size: 0.5-100 m² (herbs) to 0.1-1 ha (trees). Mark-recapture requires >50 recaptures for precision." },
      { label: "Related Concepts", value: "Occupancy modeling, distance sampling (Distance software), N-mixture models, adaptive cluster sampling, species distribution models." }
    ]} },
  description: 'Distance sampling estimates population density from line transect surveys, assuming detection decreases with distance from the transect.',
  formula: 'D = n / (2 × L × w × ê) | Area = 2 × L × w | Detectability adjustment needed',
  interpretation: 'Assumes all objects on the transect line are detected. Detection function g(x) models decreasing detectability with distance. Cluster size adjustment needed for groups.'
}

export default calcDef

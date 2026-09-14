import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ catch1: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), catch2: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), catch3: z.string().optional() }),
  fields: [
    { name: 'catch1', label: 'Catch in first session', type: 'number', min: 0, step: '1' },
    { name: 'catch2', label: 'Catch in second session', type: 'number', min: 0, step: '1' },
    { name: 'catch3', label: 'Catch in third session (optional)', type: 'number', min: 0, step: '1' },
    ],
  presets: [
    { label: 'Small mammal trapping', values: { marked: '40', recaptured: '35', markedInRecapture: '28' } },
    { label: 'Butterfly transect', values: { transectLength: '500', width: '5', observed: '120' } },
    { label: 'Forest tree quadrat', values: { quadratSize: '400', count: '15', totalArea: '10000' } },
    { label: 'Fish removal method', values: { catchDay1: '50', catchDay2: '35', catchDay3: '22' } },
    { label: 'Bird point count', values: { radius: '50', count: '8', surveys: '4' } }
    ],
  compute: (v) => { const c1 = parseInt(v.catch1); const c2 = parseInt(v.catch2); const c3 = parseInt(v.catch3)||0; const q = c2>0&&c1>0?c2/c1:0; const N = c3>0?Math.round(c2*c2/(c2-c3)):q<1?Math.round(c1/(1-q)):0; return { result: N, label: 'Population Estimate N̂', unit: '', steps: [{ label: 'Catch 1', value: `${c1}` }, { label: 'Catch 2', value: `${c2}` }, { label: 'Catch 3', value: `${c3}` }, { label: 'Catchability q', value: q.toFixed(3) }, { label: 'N̂ estimate', value: `${N}` }] ,
    extras: [
      { label: "Environmental Context", value: "Accurate population estimation is critical for wildlife management, harvest quotas, and endangered species monitoring." },
      { label: "Measurement Method", value: "Field protocols include random/stratified quadrats, line transects (distance sampling), capture-mark-recapture, and removal methods." },
      { label: "Conservation Note", value: "Population estimates inform IUCN Red List assessments, CITES quotas, and management decisions. CV < 20% is typically required for reliable estimates." },
      { label: "Typical Ranges", value: "Detection probability: 0.1-0.9. Optimal quadrat size: 0.5-100 m² (herbs) to 0.1-1 ha (trees). Mark-recapture requires >50 recaptures for precision." },
      { label: "Related Concepts", value: "Occupancy modeling, distance sampling (Distance software), N-mixture models, adaptive cluster sampling, species distribution models." }
    ]} },
  description: 'Removal method (Zippin) estimates population size from successive removal catches where capture probability is constant.',
  formula: 'Catchability q = C₂/C₁ | N̂ = C₂²/(C₂-C₃) or N̂ = C₁/(1-q)',
  interpretation: 'Requires declining catches across sessions. Assumes equal catchability. Violation leads to underestimation of true population size.'
}

export default calcDef

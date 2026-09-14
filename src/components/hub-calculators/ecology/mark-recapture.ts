import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ marked: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), captured: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), recaptured: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [
    { name: 'marked', label: 'Initially marked (M)', type: 'number', min: 1, step: '1' },
    { name: 'captured', label: 'Second capture total (C)', type: 'number', min: 1, step: '1' },
    { name: 'recaptured', label: 'Recaptured marked (R)', type: 'number', min: 0, step: '1' },
    ],
  presets: [
    { label: 'Small mammal trapping', values: { marked: '40', recaptured: '35', markedInRecapture: '28' } },
    { label: 'Butterfly transect', values: { transectLength: '500', width: '5', observed: '120' } },
    { label: 'Forest tree quadrat', values: { quadratSize: '400', count: '15', totalArea: '10000' } },
    { label: 'Fish removal method', values: { catchDay1: '50', catchDay2: '35', catchDay3: '22' } },
    { label: 'Bird point count', values: { radius: '50', count: '8', surveys: '4' } }
    ],
  compute: (v) => { const M = parseInt(v.marked); const C = parseInt(v.captured); const R = parseInt(v.recaptured); const N = R>0?Math.round(M*C/R):0; const se = R>0?Math.sqrt((M*C*(M-R)*(C-R))/(R**3)):0; return { result: N, label: 'Population Estimate N̂', unit: '', steps: [{ label: 'Marked (M)', value: `${M}` }, { label: 'Second capture (C)', value: `${C}` }, { label: 'Recaptured marked (R)', value: `${R}` }, { label: 'N̂ = M×C/R', value: `${N}` }, { label: 'SE', value: se.toFixed(1) }, { label: '95% CI', value: N>0?`[${Math.round(N-1.96*se)}, ${Math.round(N+1.96*se)}]`:'N/A' }] ,
    extras: [
      { label: "Environmental Context", value: "Accurate population estimation is critical for wildlife management, harvest quotas, and endangered species monitoring." },
      { label: "Measurement Method", value: "Field protocols include random/stratified quadrats, line transects (distance sampling), capture-mark-recapture, and removal methods." },
      { label: "Conservation Note", value: "Population estimates inform IUCN Red List assessments, CITES quotas, and management decisions. CV < 20% is typically required for reliable estimates." },
      { label: "Typical Ranges", value: "Detection probability: 0.1-0.9. Optimal quadrat size: 0.5-100 m² (herbs) to 0.1-1 ha (trees). Mark-recapture requires >50 recaptures for precision." },
      { label: "Related Concepts", value: "Occupancy modeling, distance sampling (Distance software), N-mixture models, adaptive cluster sampling, species distribution models." }
    ]} },
  description: 'Lincoln-Petersen mark-recapture estimates population size from the proportion of marked individuals in a second sample.',
  formula: 'N̂ = M×C/R | SE = √(M×C×(M-R)×(C-R)/R³)',
  interpretation: 'Assumes closed population, no marks lost, random mixing. R should be ≥10 for reliable estimates. Bias when R is small (<7).'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ captures: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0'), recaptures: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0'), marked: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0') }),
  fields: [
    { name: 'captures', label: 'Captured each session (CSV)', type: 'number' },
    { name: 'recaptures', label: 'Recaptured each session (CSV)', type: 'number' },
    { name: 'marked', label: 'Cumulatively marked before (CSV)', type: 'number' },
    ],
  presets: [
    { label: 'Small mammal trapping', values: { marked: '40', recaptured: '35', markedInRecapture: '28' } },
    { label: 'Butterfly transect', values: { transectLength: '500', width: '5', observed: '120' } },
    { label: 'Forest tree quadrat', values: { quadratSize: '400', count: '15', totalArea: '10000' } },
    { label: 'Fish removal method', values: { catchDay1: '50', catchDay2: '35', catchDay3: '22' } },
    { label: 'Bird point count', values: { radius: '50', count: '8', surveys: '4' } }
    ],
  compute: (v) => { const C = v.captures.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const R = v.recaptures.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const M = v.marked.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const n = Math.min(C.length,R.length,M.length); let sumCM = 0, sumR = 0; for(let i=0;i<n;i++){ sumCM += C[i]*M[i]; sumR += R[i]; } const N = sumR>0?Math.round(sumCM/sumR):0; return { result: N, label: 'Schnabel Population Estimate', unit: '', steps: [{ label: 'Sessions', value: `${n}` }, { label: 'Σ(C×M)', value: `${sumCM}` }, { label: 'Σ(R)', value: `${sumR}` }, { label: 'N̂ = Σ(C×M)/Σ(R)', value: `${N}` }] ,
    extras: [
      { label: "Environmental Context", value: "Accurate population estimation is critical for wildlife management, harvest quotas, and endangered species monitoring." },
      { label: "Measurement Method", value: "Field protocols include random/stratified quadrats, line transects (distance sampling), capture-mark-recapture, and removal methods." },
      { label: "Conservation Note", value: "Population estimates inform IUCN Red List assessments, CITES quotas, and management decisions. CV < 20% is typically required for reliable estimates." },
      { label: "Typical Ranges", value: "Detection probability: 0.1-0.9. Optimal quadrat size: 0.5-100 m² (herbs) to 0.1-1 ha (trees). Mark-recapture requires >50 recaptures for precision." },
      { label: "Related Concepts", value: "Occupancy modeling, distance sampling (Distance software), N-mixture models, adaptive cluster sampling, species distribution models." }
    ]} },
  description: 'Schnabel method extends Lincoln-Petersen to multiple capture sessions, providing a more robust population estimate for closed populations.',
  formula: 'N̂ = Σ(Cₜ × Mₜ) / Σ(Rₜ) | Uses cumulative marked pool across sessions',
  interpretation: 'Schnabel yields more precise estimates than single Lincoln-Petersen. Requires closed population assumption. More sessions = better precision.'
}

export default calcDef

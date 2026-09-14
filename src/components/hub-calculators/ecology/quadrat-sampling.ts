import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ counts: z.string().min(1).refine(v => v.split(',').every(s => parseInt(s) >= 0), 'CSV ≥0'), quadratSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'counts', label: 'Counts per quadrat (CSV)', type: 'number' },
    { name: 'quadratSize', label: 'Quadrat area (m²)', type: 'number', min: 0.01, step: '0.01' },
    ],
  presets: [
    { label: 'Small mammal trapping', values: { marked: '40', recaptured: '35', markedInRecapture: '28' } },
    { label: 'Butterfly transect', values: { transectLength: '500', width: '5', observed: '120' } },
    { label: 'Forest tree quadrat', values: { quadratSize: '400', count: '15', totalArea: '10000' } },
    { label: 'Fish removal method', values: { catchDay1: '50', catchDay2: '35', catchDay3: '22' } },
    { label: 'Bird point count', values: { radius: '50', count: '8', surveys: '4' } }
    ],
  compute: (v) => { const counts = v.counts.split(',').map((s:string)=>parseInt(s.trim())).filter((n:number)=>!isNaN(n)); const size = parseFloat(v.quadratSize); const mean = counts.reduce((a:number,b:number)=>a+b,0)/counts.length; const variance = counts.map((c:number)=>(c-mean)**2).reduce((a:number,b:number)=>a+b,0)/(counts.length-1); const density = mean/size; const dispersion = mean>0?variance/mean:1; return { result: density, label: 'Population Density', unit: 'ind/m²', steps: [{ label: 'Quadrat count', value: `${counts.length}` }, { label: 'Mean count', value: mean.toFixed(2) }, { label: 'Variance', value: variance.toFixed(2) }, { label: 'Density', value: `${density.toFixed(4)} ind/m²` }, { label: 'Dispersion (V/M)', value: dispersion.toFixed(2) }, { label: 'Pattern', value: dispersion>1.5?'Clumped':dispersion<0.7?'Uniform':'Random' }] ,
    extras: [
      { label: "Environmental Context", value: "Accurate population estimation is critical for wildlife management, harvest quotas, and endangered species monitoring." },
      { label: "Measurement Method", value: "Field protocols include random/stratified quadrats, line transects (distance sampling), capture-mark-recapture, and removal methods." },
      { label: "Conservation Note", value: "Population estimates inform IUCN Red List assessments, CITES quotas, and management decisions. CV < 20% is typically required for reliable estimates." },
      { label: "Typical Ranges", value: "Detection probability: 0.1-0.9. Optimal quadrat size: 0.5-100 m² (herbs) to 0.1-1 ha (trees). Mark-recapture requires >50 recaptures for precision." },
      { label: "Related Concepts", value: "Occupancy modeling, distance sampling (Distance software), N-mixture models, adaptive cluster sampling, species distribution models." }
    ]} },
  description: 'Quadrat sampling estimates population density and dispersion pattern by counting individuals within randomly placed quadrats.',
  formula: 'Density = Mean count / Quadrat area | Dispersion = Variance / Mean',
  interpretation: 'Variance/Mean = 1: random dispersion, >1: clumped, <1: uniform. Clumped distribution requires more quadrats for precise density estimates.'
}

export default calcDef

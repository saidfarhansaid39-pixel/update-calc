import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ interceptLen: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), totalLen: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'interceptLen', label: 'Total intercepted length for species (m)', type: 'number', min: 0, step: '0.1' },
    { name: 'totalLen', label: 'Total transect length (m)', type: 'number', min: 0.1, step: '0.1' },
    ],
  presets: [
    { label: 'Small mammal trapping', values: { marked: '40', recaptured: '35', markedInRecapture: '28' } },
    { label: 'Butterfly transect', values: { transectLength: '500', width: '5', observed: '120' } },
    { label: 'Forest tree quadrat', values: { quadratSize: '400', count: '15', totalArea: '10000' } },
    { label: 'Fish removal method', values: { catchDay1: '50', catchDay2: '35', catchDay3: '22' } },
    { label: 'Bird point count', values: { radius: '50', count: '8', surveys: '4' } }
    ],
  compute: (v) => { const inter = parseFloat(v.interceptLen); const total = parseFloat(v.totalLen); const cover = total>0?inter/total*100:0; return { result: cover, label: 'Line Intercept Cover', unit: '%', steps: [{ label: 'Intercepted length', value: `${inter} m` }, { label: 'Total transect length', value: `${total} m` }, { label: 'Cover = intercept/total × 100', value: `${cover.toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Accurate population estimation is critical for wildlife management, harvest quotas, and endangered species monitoring." },
      { label: "Measurement Method", value: "Field protocols include random/stratified quadrats, line transects (distance sampling), capture-mark-recapture, and removal methods." },
      { label: "Conservation Note", value: "Population estimates inform IUCN Red List assessments, CITES quotas, and management decisions. CV < 20% is typically required for reliable estimates." },
      { label: "Typical Ranges", value: "Detection probability: 0.1-0.9. Optimal quadrat size: 0.5-100 m² (herbs) to 0.1-1 ha (trees). Mark-recapture requires >50 recaptures for precision." },
      { label: "Related Concepts", value: "Occupancy modeling, distance sampling (Distance software), N-mixture models, adaptive cluster sampling, species distribution models." }
    ]} },
  description: 'Line-intercept method measures species cover as the proportion of total transect length intersected by the target species.',
  formula: 'Cover (%) = (Intercepted length / Total length) × 100',
  interpretation: 'Line intercept is efficient for estimating plant cover in dense vegetation. Multiple transects improve precision. Bias when plants are clumped.'
}

export default calcDef

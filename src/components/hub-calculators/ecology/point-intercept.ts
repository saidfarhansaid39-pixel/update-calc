import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ hits: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), total: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [
    { name: 'hits', label: 'Points hitting target species', type: 'number', min: 0, step: '1' },
    { name: 'total', label: 'Total points sampled', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Small mammal trapping', values: { marked: '40', recaptured: '35', markedInRecapture: '28' } },
    { label: 'Butterfly transect', values: { transectLength: '500', width: '5', observed: '120' } },
    { label: 'Forest tree quadrat', values: { quadratSize: '400', count: '15', totalArea: '10000' } },
    { label: 'Fish removal method', values: { catchDay1: '50', catchDay2: '35', catchDay3: '22' } },
    { label: 'Bird point count', values: { radius: '50', count: '8', surveys: '4' } }
    ],
  compute: (v) => { const hits = parseInt(v.hits); const total = parseInt(v.total); const cover = total>0?hits/total*100:0; return { result: cover, label: 'Percent Cover', unit: '%', steps: [{ label: 'Hits', value: `${hits}` }, { label: 'Total points', value: `${total}` }, { label: 'Cover = hits/total × 100', value: `${cover.toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Accurate population estimation is critical for wildlife management, harvest quotas, and endangered species monitoring." },
      { label: "Measurement Method", value: "Field protocols include random/stratified quadrats, line transects (distance sampling), capture-mark-recapture, and removal methods." },
      { label: "Conservation Note", value: "Population estimates inform IUCN Red List assessments, CITES quotas, and management decisions. CV < 20% is typically required for reliable estimates." },
      { label: "Typical Ranges", value: "Detection probability: 0.1-0.9. Optimal quadrat size: 0.5-100 m² (herbs) to 0.1-1 ha (trees). Mark-recapture requires >50 recaptures for precision." },
      { label: "Related Concepts", value: "Occupancy modeling, distance sampling (Distance software), N-mixture models, adaptive cluster sampling, species distribution models." }
    ]} },
  description: 'Point-intercept method estimates species cover by recording the proportion of sampling points where the target species is encountered.',
  formula: 'Cover (%) = (Hits / Total points) × 100',
  interpretation: 'Point-intercept is efficient for estimating cover in grasslands, shrublands, and intertidal zones. More points = greater precision.'
}

export default calcDef

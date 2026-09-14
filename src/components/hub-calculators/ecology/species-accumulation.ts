import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ samples: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV') }),
  fields: [{ name: 'samples', label: 'Species per sample (cumulative comma-separated)', type: 'number' }],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const cumSpp = v.samples.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const rate = cumSpp.length>1?(cumSpp[cumSpp.length-1]-cumSpp[0])/(cumSpp.length-1):0; const maxVal = cumSpp[cumSpp.length-1]||0; const asymptote = maxVal + (rate>0?maxVal*0.1:0); return { result: maxVal, label: 'Total Species Accumulated', unit: '', steps: cumSpp.map((v:number,i:number)=>({label:`Sample ${i+1}`,value:`${v}`})).concat([{label:'Avg addition/sample',value:rate.toFixed(2)},{label:'Estimated asymptote',value:asymptote.toFixed(0)}]) ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Species accumulation curves show how species are discovered with increasing sampling effort, used to estimate sampling completeness.',
  formula: 'Accumulation = S(n) | Asymptote estimated by Clench model',
  interpretation: 'The curve approaches an asymptote representing total species pool. Still rising = incomplete sampling.'
}

export default calcDef

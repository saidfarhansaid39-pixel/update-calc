import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ abundances: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated') }),
  fields: [{ name: 'abundances', label: 'Species abundances (comma-separated)', type: 'number' }],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const counts = v.abundances.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const total = counts.reduce((a:number,b:number)=>a+b,0); const props = counts.map((c:number)=>c/total); const H = -props.map((p:number)=>p>0?p*Math.log(p):0).reduce((a:number,b:number)=>a+b,0); const S = counts.length; const Hmax = Math.log(S); const J = Hmax>0?H/Hmax:0; return { result: J, label: "Pielou's J'", unit: '', steps: [{ label: 'Species count (S)', value: `${S}` }, { label: "H'", value: H.toFixed(4) }, { label: "H'max = ln(S)", value: Hmax.toFixed(4) }, { label: "J'", value: J.toFixed(4) }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: "Calculates Pielou's evenness index (J') measuring how evenly individuals are distributed among species.",
  formula: "J' = H' / ln(S)",
  interpretation: "J' = 1 when all species are equally abundant. J' = 0 when one species dominates. Values <0.5 indicate high dominance."
}

export default calcDef

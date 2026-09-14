import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV') }),
  fields: [{ name: 'species', label: 'Species abundances (comma-separated)', type: 'number' }],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)).sort((a:number,b:number)=>b-a); const total = counts.reduce((a:number,b:number)=>a+b,0); const relAbund = counts.map((c:number)=>(c/total*100)); const dominant = counts[0]; const ratio = counts.length>1?counts[0]/counts[counts.length-1]:1; return { result: dominant/total*100, label: 'Dominant Species %', unit: '%', steps: counts.slice(0,5).map((c:number,i:number)=>({label:`Rank ${i+1}`,value:`${c} (${relAbund[i].toFixed(1)}%)`})).concat([{label:'Dominance ratio (max/min)',value:ratio.toFixed(2)},{label:'Total species',value:`${counts.length}`}]) ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Rank abundance diagrams plot species abundance rank against relative abundance to visualize community structure.',
  formula: 'Pi = ni/N as a function of rank | Whitaker plot',
  interpretation: 'Steep slope = high dominance by few species. Shallow slope = even distribution. Geometric series = strong niche preemption.'
}

export default calcDef

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
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const total = counts.reduce((a:number,b:number)=>a+b,0); const sorted = [...counts].sort((a,b)=>b-a); const bpDominance = total>0?sorted[0]/total:0; const twoSpecies = total>0&&sorted.length>1?(sorted[0]+sorted[1])/total:0; const mcInnes = total>0?sorted.filter((c,i)=>i<2).reduce((a,b)=>a+b,0)/total:0; return { result: bpDominance*100, label: 'Berger-Parker Dominance', unit: '%', steps: [{ label: 'Most abundant species', value: `${sorted[0]}` }, { label: 'Total individuals', value: `${total}` }, { label: 'Berger-Parker d', value: bpDominance.toFixed(4) }, { label: 'Top 2 species share', value: `${(twoSpecies*100).toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Berger-Parker dominance index measures the proportional abundance of the most common species (d = Nmax/N).',
  formula: 'd = N_max / N',
  interpretation: 'd ranges from 0 (equal abundances) to 1 (single species). d > 0.5 indicates strong dominance by one species.'
}

export default calcDef

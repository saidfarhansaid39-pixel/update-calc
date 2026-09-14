import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ siteA: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated'), siteB: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated') }),
  fields: [
    { name: 'siteA', label: 'Site A abundances (comma-separated)', type: 'number' },
    { name: 'siteB', label: 'Site B abundances (comma-separated)', type: 'number' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const a = v.siteA.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const b = v.siteB.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const minLen = Math.min(a.length, b.length); const sumMin = Array.from({length: minLen}, (_,i)=>Math.min(a[i],b[i])).reduce((s:number,n:number)=>s+n,0); const sumA = a.reduce((s:number,n:number)=>s+n,0); const sumB = b.reduce((s:number,n:number)=>s+n,0); const bc = 1 - (2*sumMin)/(sumA+sumB); return { result: bc, label: 'Bray-Curtis Dissimilarity', unit: '', steps: [{ label: 'Sum site A', value: `${sumA}` }, { label: 'Sum site B', value: `${sumB}` }, { label: '2 × Σmin', value: `${(2*sumMin).toFixed(2)}` }, { label: 'Bray-Curtis', value: bc.toFixed(4) }, { label: 'Similarity', value: `${((1-bc)*100).toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Bray-Curtis dissimilarity measures community composition differences between two sites (0 = identical, 1 = completely different).',
  formula: 'BC = 1 - 2C/(S₁ + S₂) where C = sum of shared minimum abundances',
  interpretation: 'Values near 0 indicate similar communities; values near 1 indicate very different communities.'
}

export default calcDef

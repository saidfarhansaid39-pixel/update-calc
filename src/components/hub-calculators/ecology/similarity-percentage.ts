import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ siteA: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), siteB: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV') }),
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
  compute: (v) => { const a = v.siteA.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const b = v.siteB.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const minLen = Math.min(a.length,b.length); let sumMin=0,sumA=0,sumB=0; const contribs:number[]=[]; for(let i=0;i<minLen;i++){ sumMin+=Math.min(a[i],b[i]); sumA+=a[i]; sumB+=b[i]; } const bc = 1-2*sumMin/(sumA+sumB); for(let i=0;i<minLen;i++){ const p = 100*2*Math.min(a[i],b[i])/(sumA+sumB); contribs.push(p); } const avgContrib = contribs.length>0?contribs.reduce((s,n)=>s+n,0)/contribs.length:0; return { result: (1-bc)*100, label: 'Similarity Percentage', unit: '%', steps: [{ label: 'Bray-Curtis dissimilarity', value: bc.toFixed(4) }, { label: 'Percentage similarity', value: `${((1-bc)*100).toFixed(1)}%` }, { label: 'Avg species contribution', value: `${avgContrib.toFixed(2)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'SIMPER (Similarity Percentage) analysis identifies species contributing most to community similarity or dissimilarity between sites.',
  formula: 'Sim% = 100 × (1 - BC) | Species contribution = 200 × min(nᵢ₁, nᵢ₂) / Σ(n₁+n₂)',
  interpretation: 'Species with highest contribution percentages are the best discriminating taxa between groups.'
}

export default calcDef

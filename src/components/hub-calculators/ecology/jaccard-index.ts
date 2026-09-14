import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ siteA: z.string().min(1).refine(v => v.split(',').every((s:string) => !isNaN(parseFloat(s.trim()))), 'Comma-separated'), siteB: z.string().min(1).refine(v => v.split(',').every((s:string) => !isNaN(parseFloat(s.trim()))), 'Comma-separated') }),
  fields: [
    { name: 'siteA', label: 'Site A species codes (1 if present, 0 if absent, comma-separated)', type: 'number' },
    { name: 'siteB', label: 'Site B presence codes (comma-separated)', type: 'number' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const a = v.siteA.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const b = v.siteB.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const minLen = Math.min(a.length, b.length); let shared = 0; let either = 0; for (let i=0; i<minLen; i++) { if (a[i]>0 || b[i]>0) either++; if (a[i]>0 && b[i]>0) shared++; } const jaccard = either>0?shared/either:0; const sorensen = (a.length>0&&b.length>0)?2*shared/(a.reduce((s:number,n:number)=>s+(n>0?1:0),0)+b.reduce((s:number,n:number)=>s+(n>0?1:0),0)):0; return { result: jaccard, label: "Jaccard's Index", unit: '', steps: [{ label: 'Shared species', value: `${shared}` }, { label: 'Species in either site', value: `${either}` }, { label: "Jaccard's index", value: jaccard.toFixed(4) }, { label: "S\u00F8rensen's index", value: sorensen.toFixed(4) }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: "Jaccard's similarity index compares species presence-absence between two sites. Ranges from 0 (no overlap) to 1 (identical composition).",
  formula: 'J = A∩B / A∪B',
  interpretation: 'J > 0.5 indicates high similarity. J < 0.2 indicates low similarity. Common threshold for distinct communities: J < 0.25.'
}

export default calcDef

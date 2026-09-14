import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), abundThresh: z.string().optional() }),
  fields: [
    { name: 'species', label: 'Species abundances (comma-separated)', type: 'number' },
    { name: 'abundThresh', label: 'Rare species threshold (abundance <)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const thresh = parseInt(v.abundThresh)||10; const rare = counts.filter((c:number)=>c<=thresh); const abund = counts.filter((c:number)=>c>thresh); const Srare = rare.length; const Sabund = abund.length; const total = counts.reduce((a:number,b:number)=>a+b,0); const nRare = rare.reduce((a:number,b:number)=>a+b,0); const F1 = rare.filter((c:number)=>c===1).length; const Cace = 1 - F1/nRare; const gamma = Math.max(0, (Srare/Cace) * (rare.map((c:number)=>c*(c-1)).reduce((a:number,b:number)=>a+b,0) / (nRare*(nRare-1)) - 1)); const ace = Sabund + Srare/Cace + (F1/Cace)*gamma; return { result: ace, label: 'ACE Estimate', unit: '', steps: [{ label: 'Abundant species (S_abund)', value: `${Sabund}` }, { label: 'Rare species (S_rare)', value: `${Srare}` }, { label: 'Singletons (F₁)', value: `${F1}` }, { label: 'Coverage C_ACE', value: Cace.toFixed(4) }, { label: 'ACE estimate', value: ace.toFixed(1) }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Abundance-based Coverage Estimator (ACE) estimates total species richness accounting for undetected rare species.',
  formula: 'S_ACE = S_abund + S_rare/C_ACE + (F₁/C_ACE)·γ²',
  interpretation: 'ACE estimates true species richness beyond observed count. Higher ratios of singletons suggest more undetected species.'
}

export default calcDef

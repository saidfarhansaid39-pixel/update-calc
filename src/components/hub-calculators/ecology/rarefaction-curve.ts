import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'CSV'), sample: z.string().optional() }),
  fields: [
    { name: 'species', label: 'Species abundances (comma-separated)', type: 'number' },
    { name: 'sample', label: 'Rarefaction sample size', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const N = counts.reduce((a:number,b:number)=>a+b,0); const n = parseInt(v.sample)||Math.floor(N/2); if (n>N) { return { result: N, label: 'Error', unit: '', steps: [{ label: 'Sample size exceeds total N', value: `Max: ${N}` }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} } const Sobs = counts.filter((c:number)=>c>0).length; const expected = Sobs - counts.filter((c:number)=>c>0).reduce((sum:number,c:number)=>{ const term = 1 - (c*(c-1))/(N*(N-1)); return sum + (n>1?1-term**n:0); }, 0); return { result: expected, label: 'Expected Species (Rarefied)', unit: '', steps: [{ label: 'Total individuals (N)', value: `${N}` }, { label: 'Sample size (n)', value: `${n}` }, { label: 'Observed species', value: `${Sobs}` }, { label: 'Expected species (rarefied)', value: expected.toFixed(2) }] } },
  description: 'Rarefaction estimates expected species richness at a standardized sampling effort for fair comparison across communities.',
  formula: 'E(S_n) = S_obs - Σ(1 - [N - Nᵢ choose n] / [N choose n])',
  interpretation: 'Rarefaction allows comparing richness across samples of different sizes. The curve flattens as sampling approaches completeness.'
}

export default calcDef

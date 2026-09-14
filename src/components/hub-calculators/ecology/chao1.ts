import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ species: z.string().min(1).refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers') }),
  fields: [{ name: 'species', label: 'Species abundances (comma-separated, singletons first)', type: 'number' }],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const counts = v.species.split(',').map((s:string)=>parseFloat(s.trim())).filter((n:number)=>!isNaN(n)); const Sobs = counts.filter((c:number)=>c>0).length; const F1 = counts.filter((c:number)=>c===1).length; const F2 = counts.filter((c:number)=>c===2).length; const chao = F2>0 ? Sobs + (F1*F1)/(2*F2) : Sobs + (F1*(F1-1))/(2); const se = chao>0?Math.sqrt(F2>0?(F1*F1*F1*F1)/(4*F2*F2*F2)+(F1*F1*F1)/(F2*F2)+(F1*F1)/(2*F2):0):0; return { result: chao, label: 'Chao1 Richness Estimate', unit: '', steps: [{ label: 'Observed species (S_obs)', value: `${Sobs}` }, { label: 'Singletons (F₁)', value: `${F1}` }, { label: 'Doubletons (F₂)', value: `${F2}` }, { label: 'S_chao1', value: chao.toFixed(1) }, { label: 'SE', value: se.toFixed(2) }, { label: '95% CI', value: `[${(chao-1.96*se).toFixed(0)}, ${(chao+1.96*se).toFixed(0)}]` }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Chao1 is a non-parametric estimator of true species richness that accounts for undetected species based on the number of rare species (singletons and doubletons).',
  formula: 'S_chao1 = S_obs + F₁²/(2·F₂) | SE based on variance estimator',
  interpretation: 'Chao1 estimates the total number of species including those not yet observed. More singletons = more undetected species. Values usually exceed observed richness.'
}

export default calcDef

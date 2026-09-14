import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ observed: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'observed', label: 'Species observed', type: 'number', min: 1, step: '1' },
    { name: 'area', label: 'Sampling area (km²)', type: 'number', min: 0.01, step: '0.01' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const s = parseInt(v.observed); const a = parseFloat(v.area); const density = s / a; const logS = Math.log(s); const logA = Math.log(a); return { result: s, label: 'Species Richness (S)', unit: '', steps: [{ label: 'Observed species (S)', value: `${s}` }, { label: 'Area sampled', value: `${a} km²` }, { label: 'Species density', value: `${density.toFixed(4)} species/km²` }, { label: 'Log(S)', value: `${logS.toFixed(3)}` }, { label: 'Log(area)', value: `${logA.toFixed(3)}` }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Calculates species richness and density, foundational metrics for biodiversity assessment.',
  formula: 'S = number of species | Density = S / Area',
  interpretation: 'Species richness increases with area (species-area relationship). Compare only across equal sampling effort.'
}

export default calcDef

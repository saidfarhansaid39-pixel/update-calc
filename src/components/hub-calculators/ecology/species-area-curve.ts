import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), species: z.string().optional(), z: z.string().optional() }),
  fields: [
    { name: 'area', label: 'Habitat area (km²)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'species', label: 'Known species (optional)', type: 'number', min: 1, step: '1' },
    { name: 'z', label: 'z-value (slope)', type: 'number', min: 0.1, max: 0.5, step: '0.01' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => { const a = parseFloat(v.area); const S = parseFloat(v.species)||50; const zVal = parseFloat(v.z)||0.25; const refArea = 1; const logS = Math.log(S); const logA = Math.log(a); const predS = S * Math.pow(a/refArea, zVal); const per10x = S * Math.pow(10, zVal); return { result: predS, label: 'Predicted Species (S = cA^z)', unit: '', steps: [{ label: 'Area (A)', value: `${a} km²` }, { label: 'Known species (S)', value: `${S}` }, { label: 'z-value', value: zVal.toFixed(2) }, { label: 'c = S/A^z', value: (S/Math.pow(refArea, zVal)).toFixed(2) }, { label: 'Predicted species', value: predS.toFixed(0) }, { label: 'Species at 10× area', value: per10x.toFixed(0) }] ,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]} },
  description: 'Species-area relationship (SAR) predicts species richness as a function of habitat area using S = cA^z.',
  formula: 'S = cA^z | log(S) = log(c) + z·log(A)',
  interpretation: 'z ≈ 0.25 for continents, 0.25-0.35 for islands, 0.35-0.5 for isolated habitats. Higher z = steeper diversity loss with area reduction.'
}

export default calcDef

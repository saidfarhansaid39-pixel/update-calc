import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    species: z.string().min(1, 'Required').refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers'),
    samples: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'species', label: 'Species Abundances', type: 'number', step: '1' },
    { name: 'samples', label: 'Number of Samples (optional)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { species: '45,32,28,15,12,8,6,4,3,2,1' } },
    { label: 'Temperate forest', values: { species: '20,15,12,8,5,3,2,1' } },
    { label: 'Disturbed site', values: { species: '85,12,3' } },
    { label: 'Coral reef', values: { species: '30,25,22,18,15,12,10,8,6,4' } },
    { label: 'Agricultural monoculture', values: { species: '95,3,2' } }
    ],
  compute: (v) => {
    const counts = (v.species || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n))
    const total = counts.reduce((a: number, b: number) => a + b, 0)
    const richness = counts.filter((c: number) => c > 0).length
    const margalef = (richness - 1) / Math.log(total)
    const menhinick = richness / Math.sqrt(total)
    return {
      result: richness, label: 'Species Richness (S)', unit: '',
      steps: [
        { label: 'Species observed', value: `${richness}` },
        { label: 'Total individuals', value: total.toFixed(0) },
        { label: 'Margalef index', value: margalef.toFixed(4) },
        { label: 'Menhinick index', value: menhinick.toFixed(4) },
        { label: 'Interpretation', value: richness >= 20 ? 'High richness' : richness >= 10 ? 'Moderate richness' : 'Low richness' },
      ]
,
    extras: [
      { label: "Environmental Context", value: "Diversity indices are fundamental tools for quantifying community structure and comparing biodiversity across habitats, regions, or time periods." },
      { label: "Measurement Method", value: "Data collected via field surveys (quadrats, transects), eDNA metabarcoding, or citizen science platforms. Abundance data should represent counts or biomass per species." },
      { label: "Conservation Note", value: "Low diversity often indicates habitat degradation, pollution, or invasive species pressure. High diversity signals ecosystem health and resilience." },
      { label: "Typical Ranges", value: "Shannon H': 0.5-1.5 (disturbed), 1.5-3.5 (moderate), 3.5-4.5 (pristine). Simpson D: 0-1 (higher = more diverse)." },
      { label: "Related Concepts", value: "Species richness, evenness, rarefaction curves, beta diversity, Hill numbers, rank-abundance curves." }
    ]}
  },
  description: 'Species richness is the count of different species in a community. The Margalef and Menhinick indices adjust richness for sampling effort.',
  formula: 'S = number of species | Margalef: (S-1)/ln(N) | Menhinick: S/√N',
  interpretation: 'Species richness depends on sampling effort. Rarefaction curves help standardize comparisons. More samples usually reveal more species (species-area relationship).'
}

export default calcDef

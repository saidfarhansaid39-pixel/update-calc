import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    species: z.string().min(1, 'Required').refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers')
}),
  fields: [
    { name: 'species', label: 'Species Abundances', type: 'number', step: '1' },
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
    const d = counts.map((c: number) => { const p = c / total; return p * p }).reduce((a: number, b: number) => a + b, 0)
    const invD = total > 0 ? 1 / d : 0
    const gini = 1 - d
    return {
      result: gini, label: "Simpson's (1-D)", unit: '',
      steps: [
        { label: 'Total individuals', value: total.toFixed(0) },
        ...counts.map((c: number, i: number) => ({ label: `Species ${i+1}`, value: `${c} (${(c/total*100).toFixed(1)}%)` })),
        { label: 'D = Σ pᵢ²', value: d.toFixed(4) },
        { label: '1-D (diversity)', value: gini.toFixed(4) },
        { label: '1/D (inverse)', value: invD.toFixed(2) },
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
  description: "Simpson's Diversity Index measures the probability that two randomly selected individuals belong to different species. It ranges from 0 (no diversity) to 1 (infinite diversity).",
  formula: 'D = Σ(pᵢ²) | Simpson\'s Index (1-D) | Inverse Simpson (1/D)',
  interpretation: '1-D = 0 (low diversity) to ~1 (high diversity). 1/D = effective number of species. More intuitive: 1/D = 5 means the diversity equals 5 equally common species.'
}

export default calcDef

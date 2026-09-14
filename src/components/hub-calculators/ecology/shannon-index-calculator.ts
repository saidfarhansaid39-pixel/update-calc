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
    const proportions = counts.map((c: number) => c / total)
    const shannon = -proportions.map((p: number) => p > 0 ? p * Math.log(p) : 0).reduce((a: number, b: number) => a + b, 0)
    const maxDiv = Math.log(counts.length)
    const evenness = maxDiv > 0 ? shannon / maxDiv : 0
    return {
      result: shannon, label: 'Shannon-Wiener H\'', unit: '',
      steps: [
        { label: 'Number of species (S)', value: `${counts.length}` },
        { label: 'Total individuals', value: total.toFixed(0) },
        ...proportions.map((p: number, i: number) => ({ label: `p${i+1}`, value: `${p.toFixed(4)}` })),
        { label: 'H\' = -Σ pᵢ ln(pᵢ)', value: shannon.toFixed(4) },
        { label: 'H\' max = ln(S)', value: maxDiv.toFixed(4) },
        { label: 'Evenness J\'', value: evenness.toFixed(4) },
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
  description: 'The Shannon-Wiener index (H\') quantifies species diversity by accounting for both richness and evenness. It is one of the most widely used biodiversity metrics.',
  formula: "H' = -Σ(pᵢ × ln(pᵢ)) | H'max = ln(S) | J' = H'/H'max",
  interpretation: 'H\' = 0 when only one species present. Higher H\' = greater diversity. Typical values: 0.5-2 (disturbed), 2-3.5 (moderate), 3.5-4.5 (pristine).'
}

export default calcDef

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
    const richness = counts.filter((c: number) => c > 0).length
    const shannon = -counts.map((c: number) => { const p = c / total; return p > 0 ? p * Math.log(p) : 0 }).reduce((a: number, b: number) => a + b, 0)
    const hmax = Math.log(richness)
    const pielou = hmax > 0 ? shannon / hmax : 0
    return {
      result: pielou, label: "Pielou's Evenness J'", unit: '',
      steps: [
        { label: 'Species richness', value: `${richness}` },
        { label: 'Total individuals', value: total.toFixed(0) },
        { label: 'Shannon H\'', value: shannon.toFixed(4) },
        { label: 'H\' max = ln(S)', value: hmax.toFixed(4) },
        { label: 'J\' = H\'/H\'max', value: pielou.toFixed(4) },
        { label: 'Interpretation', value: pielou > 0.75 ? 'High evenness' : pielou > 0.5 ? 'Moderate evenness' : 'Low evenness (dominance)' },
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
  description: "Pielou's Evenness (J') measures how evenly individuals are distributed among species. It ranges from 0 (complete dominance) to 1 (perfect evenness).",
  formula: "J' = H'/ln(S) | H' = Shannon index | S = species count",
  interpretation: 'J\' near 0: one species dominates. J\' near 1: all species equally abundant. Low evenness often indicates disturbance, pollution, or competitive exclusion.'
}

export default calcDef

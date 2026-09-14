import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    species: z.string().min(1, 'Required').refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers'),
    area: z.string().optional().refine(v => !v || (!isNaN(parseFloat(v)) && parseFloat(v) > 0), 'Must be > 0')
}),
  fields: [
    { name: 'species', label: 'Species Abundances', type: 'number', step: '1' },
    { name: 'area', label: 'Area (optional)', type: 'number', min: 0, step: '0.1' },
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
    const shannon = -counts.map((c: number) => { const p = c / total; return p > 0 ? p * Math.log(p) : 0 }).reduce((a: number, b: number) => a + b, 0)
    const simpson = 1 - counts.map((c: number) => { const p = c / total; return p * p }).reduce((a: number, b: number) => a + b, 0)
    const area = v.area || 0
    const richness = counts.filter((c: number) => c > 0).length
    const evenness = Math.log(richness) > 0 ? shannon / Math.log(richness) : 0
    return {
      result: shannon, label: 'Shannon Index (H\')', unit: '',
      steps: [
        { label: 'Total individuals', value: total.toFixed(0) },
        { label: 'Species richness', value: richness.toFixed(0) },
        { label: 'Shannon index H\'', value: shannon.toFixed(4) },
        { label: 'Simpson index 1-D', value: simpson.toFixed(4) },
        { label: 'Pielou evenness J\'', value: evenness.toFixed(4) },
        ...(area > 0 ? [{ label: 'Species density', value: `${(richness / area).toFixed(4)} per unit area` }] : []),
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
  description: 'The Biodiversity Index Calculator computes Shannon-Wiener diversity (H\'), Simpson diversity (1-D), species richness, and Pielou evenness from abundance data.',
  formula: "H' = -Σ(pᵢ × ln(pᵢ)) | 1-D = 1 - Σ(pᵢ²) | J' = H'/ln(S)",
  interpretation: 'Shannon H\' typically ranges 0-4.5. Higher values = more diverse. Simpson 1-D ranges 0-1. Evenness J\' = 1 when all species are equally abundant.'
}

export default calcDef

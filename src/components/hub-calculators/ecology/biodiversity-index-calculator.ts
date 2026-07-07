import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    species: z.string().min(1, 'Required').refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers'),
    area: z.string().optional().refine(v => !v || (!isNaN(parseFloat(v)) && parseFloat(v) > 0), 'Must be > 0')
}),
  fields: [
    { name: 'species', label: 'Species Abundances', type: 'number', step: '1' },
    { name: 'area', label: 'Area (optional)', type: 'number', min: 0, step: '0.1' },
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
}
  },
  description: 'The Biodiversity Index Calculator computes Shannon-Wiener diversity (H\'), Simpson diversity (1-D), species richness, and Pielou evenness from abundance data.',
  formula: "H' = -Σ(pᵢ × ln(pᵢ)) | 1-D = 1 - Σ(pᵢ²) | J' = H'/ln(S)",
  interpretation: 'Shannon H\' typically ranges 0-4.5. Higher values = more diverse. Simpson 1-D ranges 0-1. Evenness J\' = 1 when all species are equally abundant.'
}

export default calcDef

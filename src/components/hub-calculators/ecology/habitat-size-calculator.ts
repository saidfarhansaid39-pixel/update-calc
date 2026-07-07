import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    species: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    density: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mvp: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'species', label: 'Target Population Size', type: 'number', min: 1, step: '1' },
    { name: 'density', label: 'Species Density', type: 'number', unit: 'indiv/ha', min: 0.01, step: '0.01' },
    { name: 'mvp', label: 'MVP Population (optional)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const mvp = v.mvp || 50
    const minArea = mvp / v.density
    const targetArea = v.species / v.density
    return {
      result: targetArea, label: 'Required Habitat Area', unit: 'ha',
      steps: [
        { label: 'Target population', value: `${v.species}` },
        { label: 'Density', value: `${v.density} indiv/ha` },
        { label: 'Area needed', value: `${targetArea.toFixed(1)} ha (${(targetArea / 100).toFixed(2)} km²)` },
        { label: 'MVP-based area', value: `${minArea.toFixed(1)} ha (${(minArea / 100).toFixed(2)} km²)` },
      ]
}
  },
  description: 'Minimum habitat size is calculated from population targets and species density. Conservation areas must be large enough to support viable populations.',
  formula: 'Area = Population size / Density | MVP-based area = MVP / Density',
  interpretation: 'Larger species need larger areas (low density). Apex predators may need 1000+ km². Minimum dynamic area accounts for disturbances and edge effects.'
}

export default calcDef

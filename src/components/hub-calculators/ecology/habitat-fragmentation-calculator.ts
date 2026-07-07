import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    totalArea: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    patchArea: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    patchCount: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    perimeter: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'totalArea', label: 'Total Landscape Area', type: 'number', unit: 'ha', min: 1, step: '1' },
    { name: 'patchArea', label: 'Average Patch Area', type: 'number', unit: 'ha', min: 0.1, step: '0.1' },
    { name: 'patchCount', label: 'Number of Patches', type: 'number', min: 1, step: '1' },
    { name: 'perimeter', label: 'Avg. Patch Perimeter (opt)', type: 'number', unit: 'm', min: 0, step: '10' },
  ],
  compute: (v) => {
    const totalHabitat = v.patchArea * v.patchCount
    const propHabitat = v.totalArea > 0 ? totalHabitat / v.totalArea * 100 : 0
    const edgeRatio = v.perimeter && v.perimeter > 0 ? v.perimeter / (2 * Math.sqrt(Math.PI * v.patchArea * 10000)) : 0
    return {
      result: propHabitat, label: 'Proportion of Habitat', unit: '%',
      steps: [
        { label: 'Total landscape', value: `${v.totalArea} ha` },
        { label: 'Total habitat', value: `${totalHabitat.toFixed(1)} ha (${v.patchCount} patches)` },
        { label: 'Habitat proportion', value: `${propHabitat.toFixed(1)}%` },
        { label: 'Mean patch size', value: `${v.patchArea} ha` },
        ...(v.perimeter ? [
          { label: 'Edge-to-area ratio', value: `${v.perimeter > 0 ? (v.perimeter / (v.patchArea * 10000 * 4)).toFixed(6) : '—'}` },
          { label: 'Shape complexity', value: edgeRatio > 2 ? 'Irregular (high edge)' : edgeRatio > 1.2 ? 'Moderate' : 'Compact (low edge)' },
        ] : []),
        { label: 'Fragmentation', value: propHabitat < 30 ? 'High fragmentation' : propHabitat < 60 ? 'Moderate' : 'Low fragmentation' },
      ]
}
  },
  description: 'Habitat fragmentation metrics quantify landscape structure. Edge effects, patch size, and connectivity affect species survival in fragmented landscapes.',
  formula: 'Habitat % = (Habitat area / Landscape area) × 100 | Edge ratio = Perimeter / 2√(πArea)',
  interpretation: '>60% habitat: low fragmentation risk. 30-60%: moderate. <30%: high fragmentation. Edge effects penetrate 50-100m into habitat patches.'
}

export default calcDef

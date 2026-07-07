import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    liveCells: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    deadCells: z.string().refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'liveCells', label: 'Live Cells Counted', type: 'number', min: 0, step: '1' },
    { name: 'deadCells', label: 'Dead Cells (trypan blue+)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const total = v.liveCells + v.deadCells
    const viability = total > 0 ? (v.liveCells / total) * 100 : 0
    return {
      result: viability, label: 'Cell Viability', unit: '%',
      steps: [
        { label: 'Live cells', value: `${v.liveCells}` },
        { label: 'Dead cells (blue)', value: `${v.deadCells}` },
        { label: 'Total cells', value: `${total}` },
        { label: 'Viability = live / total × 100', value: `${viability.toFixed(1)}%` },
        { label: 'Culture quality', value: viability > 90 ? 'Excellent' : viability > 80 ? 'Good' : viability > 70 ? 'Adequate' : 'Poor — replace culture' },
      ]
}
  },
  description: 'Cell viability is the percentage of live cells in a population, typically assessed by trypan blue exclusion. Live cells exclude the dye while dead cells with compromised membranes take it up.',
  formula: 'Viability (%) = (live cells / total cells) × 100',
  interpretation: 'Healthy cultures: >90% viable. Passaging recommended at 80-90%. Experiments require >80-90% viability depending on assay. Low viability indicates stress, contamination, or senescence.'
}

export default calcDef

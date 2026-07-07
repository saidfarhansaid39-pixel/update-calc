import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    totalCells: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    dividingCells: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'totalCells', label: 'Total Cells Counted', type: 'number', min: 10, step: '1' },
    { name: 'dividingCells', label: 'Cells in Mitosis', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const mi = v.dividingCells / v.totalCells * 100
    return {
      result: mi, label: 'Mitotic Index', unit: '%',
      steps: [
        { label: 'Total cells', value: `${v.totalCells}` },
        { label: 'Dividing cells', value: `${v.dividingCells}` },
        { label: 'Mitotic index', value: `${mi.toFixed(2)}%` },
        { label: 'Interpretation', value: mi < 1 ? 'Low mitotic activity' : mi < 5 ? 'Normal mitotic activity' : 'High mitotic activity (rapid growth)' },
      ]
}
  },
  description: 'The mitotic index is the proportion of cells undergoing mitosis. It indicates the proliferative activity of a tissue and is used in cancer pathology grading.',
  formula: 'Mitotic Index = (Cells in mitosis / Total cells counted) × 100%',
  interpretation: 'Normal tissues: <1% mitotic cells. High mitotic index (>5%) suggests rapid cell division, common in cancer and developing tissues.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mitoticCells: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    totalCells: z.string().refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'mitoticCells', label: 'Cells in Mitosis', type: 'number', min: 0, step: '1' },
    { name: 'totalCells', label: 'Total Cells Counted', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const mitoticIdx = (v.mitoticCells / v.totalCells) * 100
    return {
      result: mitoticIdx, label: 'Mitotic Index', unit: '%',
      steps: [
        { label: 'Cells in mitosis', value: `${v.mitoticCells}` },
        { label: 'Total cells counted', value: `${v.totalCells}` },
        { label: 'Mitotic index = mitotic / total × 100', value: `${mitoticIdx.toFixed(2)}%` },
        { label: 'Proliferation interpretation', value: mitoticIdx < 0.5 ? 'Low proliferation' : mitoticIdx < 2 ? 'Moderate' : mitoticIdx < 5 ? 'High' : 'Very high proliferation' },
      ]
}
  },
  description: 'Mitotic index is the percentage of cells in a population that are undergoing mitosis. It measures cell proliferation activity and is used in cancer grading.',
  formula: 'Mitotic Index (%) = (number of mitotic cells / total cells counted) × 100',
  interpretation: 'Higher mitotic index = faster proliferation. Used in tumor grading (e.g., Nottingham score for breast cancer). Normal tissues: <0.5%. Actively growing cultures: 2-5%. Cancer tissues: variable, >5% in aggressive tumors.'
}

export default calcDef

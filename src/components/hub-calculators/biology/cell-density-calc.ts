import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    cellCount2: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    squareCount: z.string().refine(v => parseInt(v) > 0, '>0'),
    dilutionFactor2: z.string().refine(v => parseFloat(v) >= 1, '>=1')
}),
  fields: [
    { name: 'cellCount2', label: 'Total Cells Counted', type: 'number', min: 0, step: '1' },
    { name: 'squareCount', label: 'Number of Squares Counted', type: 'number', min: 1, max: 25, step: '1' },
    { name: 'dilutionFactor2', label: 'Dilution Factor (trypan blue)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const cellsPerMl = v.squareCount > 0 ? (v.cellCount2 / v.squareCount) * 10 ** 4 * v.dilutionFactor2 : 0
    const viability2 = 0
    return {
      result: cellsPerMl, label: 'Cell Concentration', unit: 'cells/mL',
      steps: [
        { label: 'Cells counted', value: `${v.cellCount2}` },
        { label: 'Squares counted', value: `${v.squareCount}` },
        { label: 'Dilution factor', value: `${v.dilutionFactor2}` },
        { label: 'Cells/mL = (count/squares) × 104 × dilution', value: `${cellsPerMl.toExponential(4)}` },
        { label: 'Total cells in 10 mL', value: `${(cellsPerMl * 10).toExponential(4)}` },
      ]
}
  },
  description: 'Calculate cell concentration from hemocytometer counts. The standard formula accounts for the hemocytometer chamber volume (104 per mL per square) and sample dilution.',
  formula: 'Cells/mL = (total cells counted / squares counted) × 104 × dilution factor | Count at least 100-200 cells for statistical accuracy',
  interpretation: 'Standard hemocytometer: 9 large squares (1 mm² each), depth 0.1 mm. Count cells in 4 corner squares + center. Aim for 100-300 cells per counted area. Include viability assessment with trypan blue.'
}

export default calcDef

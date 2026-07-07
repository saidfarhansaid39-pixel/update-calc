import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    cellCount: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '>=0'),
    squares: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    dilution: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '>=1')
}),
  fields: [
    { name: 'cellCount', label: 'Cells Counted', type: 'number', min: 0, step: '1' },
    { name: 'squares', label: 'Number of 1 mm² Squares', type: 'number', min: 1, max: 25, step: '1' },
    { name: 'dilution', label: 'Dilution Factor (trypan blue)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const conc = v.squares > 0 ? (v.cellCount / v.squares) * 1e4 * v.dilution : 0
    return {
      result: conc, label: 'Cell Concentration', unit: 'cells/mL',
      steps: [
        { label: 'Cells counted', value: `${v.cellCount}` },
        { label: 'Squares counted', value: `${v.squares}` },
        { label: 'Avg per square', value: `${(v.cellCount / v.squares).toFixed(1)}` },
        { label: 'Dilution factor', value: `${v.dilution}` },
        { label: 'Conc = (count/squares) × 104 × DF', value: `${conc.toExponential(4)} cells/mL` },
        { label: 'Total in 10 mL', value: `${(conc * 10).toExponential(4)} cells` },
      ]
}
  },
  description: 'Hemocytometer cell counting determines cell concentration. The chamber depth of 0.1 mm gives a volume of 0.1 µL per 1 mm² square, so the conversion factor is 104 cells/mL per cell per square.',
  formula: 'Cells/mL = (avg count per square) × 104 × dilution factor | Count 100-300 cells for statistical accuracy',
  interpretation: 'Standard: count 4 corner + center squares (total 5). Aim for 20-50 cells per square. < 10/square: count more squares. > 100/square: dilute sample. Mix well before sampling. Include viability assessment with trypan blue.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), spacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rows: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'length', label: 'Bed Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Bed Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'spacing', label: 'Plant Spacing (ft)', type: 'number', min: 0.25, step: '0.25' },
    { name: 'rows', label: 'Number of Rows', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const plantsPerRow = Math.floor(v.length / v.spacing) + 1
    const totalPlants = plantsPerRow * v.rows
    const area = v.length * v.width
    const perSqFt = totalPlants / area
    return { result: totalPlants, label: 'Total Plants Needed', unit: '', steps: [{ label: 'Plants per Row', value: `${plantsPerRow}` }, { label: 'Number of Rows', value: `${v.rows}` }, { label: 'Total Plants', value: `${totalPlants}` }, { label: 'Plant Density', value: `${perSqFt.toFixed(2)} plants/sq ft` }] }
  },
  description: 'Calculate how many plants fit in a garden bed based on bed dimensions and desired plant spacing. Plan your garden layout efficiently.',
  formula: 'Plants = (Length/Spacing + 1) × Rows | Density = Plants / (L×W)',
  interpretation: 'Wide spacing (2-3 ft) for tomatoes, peppers, and large vegetables. Medium spacing (1 ft) for lettuce and flowers. Tight spacing (4-6 in) for carrots, onions, and ground covers.'
}

export default calcDef

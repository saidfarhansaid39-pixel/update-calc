import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bedLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), spacingInches: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), seedsPerCell: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'bedLength', label: 'Bed Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedWidth', label: 'Bed Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'spacingInches', label: 'Spacing Between Plants (in)', type: 'number', min: 1, step: '1' },
    { name: 'seedsPerCell', label: 'Seeds per Planting Spot', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const spacingFt = v.spacingInches / 12
    const plantsPerRow = Math.floor(v.bedLength / spacingFt) + 1
    const rows = Math.floor(v.bedWidth / spacingFt) + 1
    const totalPlants = plantsPerRow * rows
    const totalSeeds = totalPlants * v.seedsPerCell
    return { result: totalSeeds, label: 'Total Seeds Needed', unit: '', steps: [{ label: 'Plants per Row', value: `${plantsPerRow}` }, { label: 'Number of Rows', value: `${rows}` }, { label: 'Total Plants', value: `${totalPlants}` }, { label: 'Total Seeds', value: `${totalSeeds} (${v.seedsPerCell} seeds/spot)` }] }
  },
  description: 'Calculate how many seeds you need for a garden bed based on bed dimensions, spacing, and seeds per planting spot.',
  formula: 'Seeds = (Floor(L/Spacing)+1) × (Floor(W/Spacing)+1) × Seeds/Spot',
  interpretation: 'Plant 2-3 seeds per spot and thin to the strongest seedling. Spacing examples: tomatoes 24 in, carrots 2 in, lettuce 12 in, beans 4 in. Succession planting extends harvest season.'
}

export default calcDef

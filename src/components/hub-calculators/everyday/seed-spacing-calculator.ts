import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gardenWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rowSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), plantSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gardenLength', label: 'Garden Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'gardenWidth', label: 'Garden Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'rowSpacing', label: 'Row Spacing (in)', type: 'number', min: 1, step: '6' },
    { name: 'plantSpacing', label: 'Plant Spacing (in)', type: 'number', min: 1, step: '2' },
  ],
  compute: (v) => {
    const rowSpacingFt = v.rowSpacing / 12
    const plantSpacingFt = v.plantSpacing / 12
    const rows = Math.floor(v.gardenWidth / rowSpacingFt)
    const plantsPerRow = Math.floor(v.gardenLength / plantSpacingFt)
    const totalPlants = rows * plantsPerRow
    const sqftPerPlant = rowSpacingFt * plantSpacingFt
    return { result: totalPlants, label: 'Total Plants', unit: '', steps: [{ label: 'Rows (width/row spacing)', value: `${rows} rows` }, { label: 'Plants per Row', value: `${plantsPerRow}` }, { label: 'Total Plants', value: `${totalPlants}` }, { label: 'Space per Plant', value: `${sqftPerPlant.toFixed(2)} sq ft` }] }
  },
  description: 'Calculate the number of plants that fit in a garden using row spacing and plant spacing to optimize your garden layout.',
  formula: 'Plants = (Width/RowSpacing) × (Length/PlantSpacing) | Convert inches to feet',
  interpretation: 'Row spacing varies by crop: 18-36 in for large vegetables, 6-12 in for small. Square foot gardening uses 1-16 plants per sq ft depending on crop size. Wider rows improve air circulation and reduce disease.'
}

export default calcDef

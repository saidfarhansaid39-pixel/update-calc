import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ herbArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), herbType: z.string().min(1) }),
  fields: [
    { name: 'herbArea', label: 'Garden Area (sq ft)', type: 'number', min: 1, step: '1' },
    { name: 'herbType', label: 'Herb Type', type: 'select', options: [{ label: 'Basil', value: 'basil' }, { label: 'Mint', value: 'mint' }, { label: 'Rosemary', value: 'rosemary' }, { label: 'Thyme', value: 'thyme' }, { label: 'Parsley', value: 'parsley' }, { label: 'Cilantro', value: 'cilantro' }, { label: 'Chives', value: 'chives' }, { label: 'Mixed Herbs', value: 'mixed' }] },
  ],
  compute: (v) => {
    const spacingRecord: Record<string, number> = { basil: 1, mint: 1.5, rosemary: 1.5, thyme: 0.75, parsley: 0.75, cilantro: 0.5, chives: 0.5, mixed: 1 }
    const spacing = spacingRecord[v.herbType as keyof typeof spacingRecord] || 1
    const plantsPerSqFt = 1 / (spacing * spacing)
    const totalPlants = Math.ceil(v.herbArea * plantsPerSqFt)
    const varieties = v.herbType === 'mixed' ? Math.min(totalPlants, 4) : 1
    return { result: totalPlants, label: 'Plants Needed', unit: '', steps: [{ label: 'Herb Type', value: v.herbType }, { label: 'Area', value: `${v.herbArea} sq ft` }, { label: 'Spacing', value: `${spacing} ft` }, { label: 'Plants Needed', value: `${totalPlants}` }, { label: 'Varieties', value: `${varieties}` }] }
  },
  description: 'Plan your herb garden with plant spacing calculations. Determine how many herb plants fit in your available garden area.',
  formula: 'Plants = Area × (1 / Spacing²) | Basil: 12in, Mint/Rosemary: 18in, Thyme/Parsley: 9in, Cilantro/Chives: 6in',
  interpretation: 'Most culinary herbs need 6-8 hours of sunlight. Start with 3-5 plants for a family. Herbs are easy to grow in containers. Harvest by cutting stems, not individual leaves.'
}

export default calcDef

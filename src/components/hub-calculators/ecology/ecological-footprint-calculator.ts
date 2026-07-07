import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    housing: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    transport: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    food: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    goods: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'housing', label: 'Housing Footprint', type: 'number', unit: 'global ha', min: 0, step: '0.1' },
    { name: 'transport', label: 'Transport Footprint', type: 'number', unit: 'global ha', min: 0, step: '0.1' },
    { name: 'food', label: 'Food Footprint', type: 'number', unit: 'global ha', min: 0, step: '0.1' },
    { name: 'goods', label: 'Goods & Services', type: 'number', unit: 'global ha', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const housing = v.housing || 0
    const transport = v.transport || 0
    const food = v.food || 0
    const goods = v.goods || 0
    const total = housing + transport + food + goods
    return {
      result: total, label: 'Ecological Footprint', unit: 'global ha',
      steps: [
        ...(housing > 0 ? [{ label: 'Housing', value: `${housing.toFixed(1)} gha` }] : []),
        ...(transport > 0 ? [{ label: 'Transport', value: `${transport.toFixed(1)} gha` }] : []),
        ...(food > 0 ? [{ label: 'Food', value: `${food.toFixed(1)} gha` }] : []),
        ...(goods > 0 ? [{ label: 'Goods & services', value: `${goods.toFixed(1)} gha` }] : []),
        { label: 'Total', value: `${total.toFixed(2)} gha` },
        { label: 'Earths needed', value: total > 0 ? `${(total / 1.6).toFixed(1)} (global biocapacity: 1.6 gha/person)` : '—' },
      ]
}
  },
  description: 'The ecological footprint measures the amount of productive land and sea needed to support your lifestyle, measured in global hectares (gha).',
  formula: 'Total Footprint = Housing + Transport + Food + Goods | Earths needed = Footprint / 1.6 gha',
  interpretation: 'Global biocapacity: 1.6 gha/person. US average: 8.1 gha. EU average: 4.5 gha. Living within planetary boundaries requires < 1.6 gha per person.'
}

export default calcDef

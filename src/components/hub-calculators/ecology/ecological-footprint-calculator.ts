import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'US average', values: { cropland: '0.5', pasture: '0.3', forest: '0.2', fishing: '0.1', builtUp: '0.15' } },
    { label: 'EU average', values: { cropland: '0.4', pasture: '0.15', forest: '0.25', fishing: '0.05', builtUp: '0.1' } },
    { label: 'Global average', values: { cropland: '0.3', pasture: '0.1', forest: '0.1', fishing: '0.05', builtUp: '0.05' } },
    { label: 'Developing nation', values: { cropland: '0.2', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.02' } },
    { label: 'One-planet living', values: { cropland: '0.25', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.05' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Ecological footprint measures human demand on nature. Humanity currently uses ~1.75 Earths annually — an overshoot that depletes natural capital." },
      { label: "Measurement Method", value: "National Footprint Accounts use UN data on production, trade, and land use. Biocapacity calculated from crop, forest, grazing, and fishing area × yield factors." },
      { label: "Conservation Note", value: "Reducing per-capita footprint from 2.7 to <1.6 gha is essential for sustainability. High-income countries have 3-5× the global average footprint." },
      { label: "Typical Ranges", value: "World average: 2.7 gha/person. US: 8.1, EU: 4.5, China: 3.4, India: 1.1. Biocapacity per person declining as population grows." },
      { label: "Related Concepts", value: "Planetary boundaries, doughnut economics, one-planet living, circular economy, natural capital accounting, SDGs." }
    ]}
  },
  description: 'The ecological footprint measures the amount of productive land and sea needed to support your lifestyle, measured in global hectares (gha).',
  formula: 'Total Footprint = Housing + Transport + Food + Goods | Earths needed = Footprint / 1.6 gha',
  interpretation: 'Global biocapacity: 1.6 gha/person. US average: 8.1 gha. EU average: 4.5 gha. Living within planetary boundaries requires < 1.6 gha per person.'
}

export default calcDef

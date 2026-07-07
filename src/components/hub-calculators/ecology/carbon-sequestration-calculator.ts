import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    hectares: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    type: z.string(),
    years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'hectares', label: 'Forest Area', type: 'number', unit: 'hectares', min: 0.1, step: '0.1' },
    { name: 'type', label: 'Forest Type', type: 'select', options: [
      { label: 'Tropical rainforest', value: 'tropical' },
      { label: 'Temperate forest', value: 'temperate' },
      { label: 'Boreal forest', value: 'boreal' },
      { label: 'Mangrove', value: 'mangrove' },
      { label: 'Grassland / savanna', value: 'grassland' },
    ] },
    { name: 'years', label: 'Time Period', type: 'number', unit: 'years', min: 1, step: '1' },
  ],
  compute: (v) => {
    const rates: Record<string, number> = { tropical: 18, temperate: 10, boreal: 4, mangrove: 22, grassland: 3 }
    const rate = rates[v.type] || 10
    const total = v.hectares * rate * v.years
    return {
      result: total, label: 'Total Carbon Sequestration', unit: 'tons CO₂',
      steps: [
        { label: 'Forest area', value: `${v.hectares} ha` },
        { label: 'Forest type', value: `${v.type}` },
        { label: 'Sequestration rate', value: `${rate} tons CO₂/ha/yr` },
        { label: 'Time period', value: `${v.years} years` },
        { label: 'Total sequestered', value: `${total.toFixed(0)} tons CO₂` },
        { label: 'Equivalent to', value: `${(total / 4.7).toFixed(0)} cars taken off road for 1 year` },
      ]
}
  },
  description: 'Forests are natural carbon sinks. Calculate how much CO₂ a forest can sequester based on area, forest type, and time period.',
  formula: 'Sequestration = Area × Rate × Time | Tropical: 18, Temperate: 10, Boreal: 4, Mangrove: 22 tons CO₂/ha/yr',
  interpretation: 'Tropical forests sequester the most carbon per hectare. Mangroves and peatlands are carbon-dense ecosystems. Old-growth forests store more carbon than plantations.'
}

export default calcDef

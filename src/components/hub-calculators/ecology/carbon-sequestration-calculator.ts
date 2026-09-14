import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'US average', values: { miles: '12000', mpg: '25', kwh: '10800', diet: '2.5' } },
    { label: 'EU average', values: { miles: '8000', mpg: '45', kwh: '6200', diet: '2.5' } },
    { label: 'Vegan commuter', values: { miles: '5000', mpg: '30', kwh: '4000', diet: '1.5' } },
    { label: 'Large family', values: { miles: '18000', mpg: '20', kwh: '15000', diet: '3.3' } },
    { label: 'Off-grid minimal', values: { miles: '2000', mpg: '50', kwh: '1000', diet: '1.7' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Carbon accounting is essential for climate mitigation. Forests store ~45% of terrestrial carbon; soils store ~2× more than the atmosphere." },
      { label: "Measurement Method", value: "Eddy covariance flux towers, allometric equations, soil cores, remote sensing (LiDAR, satellite). IPCC guidelines provide standardized methodologies." },
      { label: "Conservation Note", value: "Protecting and restoring carbon-rich ecosystems (peatlands, mangroves, old-growth forests) provides dual climate-biodiversity benefits." },
      { label: "Typical Ranges", value: "Tropical forests: 200-400 Mg C/ha. Temperate: 100-250 Mg C/ha. Boreal: 50-150 Mg C/ha. US avg footprint: ~16 t CO₂e/person/yr." },
      { label: "Related Concepts", value: "Carbon cycle, greenhouse gas inventory, carbon credits, REDD+, net-zero, carbon sequestration potential." }
    ]}
  },
  description: 'Forests are natural carbon sinks. Calculate how much CO₂ a forest can sequester based on area, forest type, and time period.',
  formula: 'Sequestration = Area × Rate × Time | Tropical: 18, Temperate: 10, Boreal: 4, Mangrove: 22 tons CO₂/ha/yr',
  interpretation: 'Tropical forests sequester the most carbon per hectare. Mangroves and peatlands are carbon-dense ecosystems. Old-growth forests store more carbon than plantations.'
}

export default calcDef

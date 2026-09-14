import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    source: z.string(),
    amount: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'source', label: 'Emission Source', type: 'select', options: [
      { label: 'Gasoline (gallons)', value: 'gasoline' },
      { label: 'Diesel (gallons)', value: 'diesel' },
      { label: 'Natural gas (therms)', value: 'natural_gas' },
      { label: 'Coal (tons)', value: 'coal' },
      { label: 'Propane (gallons)', value: 'propane' },
    ] },
    { name: 'amount', label: 'Amount', type: 'number', min: 0.1, step: '0.1' },
    ],
  presets: [
    { label: 'US average', values: { miles: '12000', mpg: '25', kwh: '10800', diet: '2.5' } },
    { label: 'EU average', values: { miles: '8000', mpg: '45', kwh: '6200', diet: '2.5' } },
    { label: 'Vegan commuter', values: { miles: '5000', mpg: '30', kwh: '4000', diet: '1.5' } },
    { label: 'Large family', values: { miles: '18000', mpg: '20', kwh: '15000', diet: '3.3' } },
    { label: 'Off-grid minimal', values: { miles: '2000', mpg: '50', kwh: '1000', diet: '1.7' } }
    ],
  compute: (v) => {
    const factors: Record<string, number> = { gasoline: 8.887, diesel: 10.21, natural_gas: 5.3, coal: 2085, propane: 5.75 }
    const factor = factors[v.source] || 8.887
    const co2 = v.amount * factor
    const unit = v.source === 'coal' ? 'tons' : 'kg'
    return {
      result: co2, label: 'CO₂ Emissions', unit: unit,
      steps: [
        { label: 'Source', value: `${v.source}` },
        { label: 'Amount', value: `${v.amount}` },
        { label: 'Emission factor', value: `${factor} ${unit}/unit` },
        { label: 'Total CO₂', value: `${co2.toFixed(1)} ${unit}` },
        { label: 'Equivalent', value: unit === 'kg' ? `${(co2/1000).toFixed(3)} tons` : `${(co2*1000).toFixed(0)} kg` },
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
  description: 'Calculate CO₂ emissions from various fossil fuel sources using EPA emission factors. Compare the climate impact of different energy sources.',
  formula: 'CO₂ = Amount × Emission Factor | Gasoline: 8.887 kg/gal | Diesel: 10.21 kg/gal | Coal: 2085 kg/ton',
  interpretation: 'Coal produces ~235× more CO₂ per unit than natural gas. Natural gas emits ~40% less CO₂ than coal per unit of energy. Diesel emits ~15% more than gasoline per gallon.'
}

export default calcDef

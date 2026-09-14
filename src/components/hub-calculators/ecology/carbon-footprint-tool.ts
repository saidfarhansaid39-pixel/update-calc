import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ elec: z.string().optional(), gas: z.string().optional(), miles: z.string().optional(), diet: z.string().optional() }),
  fields: [
    { name: 'elec', label: 'Electricity (kWh/month)', type: 'number', min: 0, step: '1' },
    { name: 'gas', label: 'Natural gas (therms/month)', type: 'number', min: 0, step: '1' },
    { name: 'miles', label: 'Car miles/year', type: 'number', min: 0, step: '1' },
    { name: 'diet', label: 'Diet type', type: 'select', options: [{ label: 'Meat-heavy', value: 'meat' }, { label: 'Average', value: 'avg' }, { label: 'Vegetarian', value: 'veg' }, { label: 'Vegan', value: 'vegan' }] },
    ],
  presets: [
    { label: 'US average', values: { miles: '12000', mpg: '25', kwh: '10800', diet: '2.5' } },
    { label: 'EU average', values: { miles: '8000', mpg: '45', kwh: '6200', diet: '2.5' } },
    { label: 'Vegan commuter', values: { miles: '5000', mpg: '30', kwh: '4000', diet: '1.5' } },
    { label: 'Large family', values: { miles: '18000', mpg: '20', kwh: '15000', diet: '3.3' } },
    { label: 'Off-grid minimal', values: { miles: '2000', mpg: '50', kwh: '1000', diet: '1.7' } }
    ],
  compute: (v) => { const elecCO2 = (parseFloat(v.elec)||0) * 0.92 * 12; const gasCO2 = (parseFloat(v.gas)||0) * 5.3 * 12; const carCO2 = (parseFloat(v.miles)||0) * 0.4; const dietMap: Record<string, number> = { meat: 2400, avg: 1600, veg: 900, vegan: 600 }; const dietCO2 = dietMap[v.diet||'avg']; const total = elecCO2 + gasCO2 + carCO2 + dietCO2; return { result: total, label: 'Annual Carbon Footprint', unit: 'kg CO₂e', steps: [{ label: 'Electricity', value: `${elecCO2.toFixed(0)} kg` }, { label: 'Gas', value: `${gasCO2.toFixed(0)} kg` }, { label: 'Car travel', value: `${carCO2.toFixed(0)} kg` }, { label: 'Diet', value: `${dietCO2} kg` }, { label: 'Total', value: `${total.toFixed(0)} kg` }] ,
    extras: [
      { label: "Environmental Context", value: "Carbon accounting is essential for climate mitigation. Forests store ~45% of terrestrial carbon; soils store ~2× more than the atmosphere." },
      { label: "Measurement Method", value: "Eddy covariance flux towers, allometric equations, soil cores, remote sensing (LiDAR, satellite). IPCC guidelines provide standardized methodologies." },
      { label: "Conservation Note", value: "Protecting and restoring carbon-rich ecosystems (peatlands, mangroves, old-growth forests) provides dual climate-biodiversity benefits." },
      { label: "Typical Ranges", value: "Tropical forests: 200-400 Mg C/ha. Temperate: 100-250 Mg C/ha. Boreal: 50-150 Mg C/ha. US avg footprint: ~16 t CO₂e/person/yr." },
      { label: "Related Concepts", value: "Carbon cycle, greenhouse gas inventory, carbon credits, REDD+, net-zero, carbon sequestration potential." }
    ]} },
  description: 'Estimates personal annual carbon footprint from energy, transportation, and diet.',
  formula: 'CO₂e = Σ(sources) using standard emission factors',
  interpretation: 'Average US: ~16,000 kg/yr. EU: ~6,800 kg/yr. Global target: ~2,000 kg/yr by 2050.'
}

export default calcDef

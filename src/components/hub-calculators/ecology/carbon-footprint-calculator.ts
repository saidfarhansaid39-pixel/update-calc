import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    miles: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    mpg: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    kwh: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    diet: z.string().optional()
}),
  fields: [
    { name: 'miles', label: 'Annual Miles Driven', type: 'number', min: 0, step: '100' },
    { name: 'mpg', label: 'Fuel Economy (mpg)', type: 'number', min: 1, step: '1' },
    { name: 'kwh', label: 'Annual Electricity (kWh)', type: 'number', min: 0, step: '100' },
    { name: 'diet', label: 'Diet Type', type: 'select', options: [
      { label: 'Meat-heavy (3.3 tons/yr)', value: '3.3' },
      { label: 'Average (2.5 tons/yr)', value: '2.5' },
      { label: 'Vegetarian (1.7 tons/yr)', value: '1.7' },
      { label: 'Vegan (1.5 tons/yr)', value: '1.5' },
    ] },
    ],
  presets: [
    { label: 'US average', values: { miles: '12000', mpg: '25', kwh: '10800', diet: '2.5' } },
    { label: 'EU average', values: { miles: '8000', mpg: '45', kwh: '6200', diet: '2.5' } },
    { label: 'Vegan commuter', values: { miles: '5000', mpg: '30', kwh: '4000', diet: '1.5' } },
    { label: 'Large family', values: { miles: '18000', mpg: '20', kwh: '15000', diet: '3.3' } },
    { label: 'Off-grid minimal', values: { miles: '2000', mpg: '50', kwh: '1000', diet: '1.7' } }
    ],
  compute: (v) => {
    const miles = v.miles || 0
    const mpg = v.mpg || 25
    const kwh = v.kwh || 0
    const diet = parseFloat(v.diet) || 2.5
    const transport = miles > 0 && mpg > 0 ? (miles / mpg) * 8.887 / 1000 : 0
    const electricity = kwh * 0.00092
    const total = transport + electricity + diet
    return {
      result: total, label: 'Total Carbon Footprint', unit: 'tons CO₂/yr',
      steps: [
        ...(miles > 0 ? [{ label: 'Transport', value: `${transport.toFixed(2)} tons CO₂/yr` }] : []),
        ...(kwh > 0 ? [{ label: 'Electricity', value: `${electricity.toFixed(2)} tons CO₂/yr` }] : []),
        { label: 'Diet', value: `${diet.toFixed(1)} tons CO₂/yr` },
        { label: 'Total', value: `${total.toFixed(2)} tons CO₂/yr` },
        { label: 'VS US avg (16 tons)', value: total < 16 ? `${((1 - total/16)*100).toFixed(0)}% below average` : `${((total/16 - 1)*100).toFixed(0)}% above average` },
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
  description: 'Your carbon footprint is the total CO₂ emissions from transportation, energy use, diet, and lifestyle. The US average is ~16 tons CO₂ per person per year.',
  formula: 'Transport = (miles/mpg) × 8.887 kg/gal ÷ 1000 | Electricity = kWh × 0.00092 tons/kWh',
  interpretation: 'Global target: ~2 tons CO₂/person/year by 2050 (Paris Agreement). US average: 16 tons. EU average: 8 tons. World average: 5 tons.'
}

export default calcDef

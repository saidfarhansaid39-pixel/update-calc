import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    dbh: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    species: z.string()
}),
  fields: [
    { name: 'dbh', label: 'Diameter at Breast Height', type: 'number', unit: 'cm', min: 1, step: '0.1' },
    { name: 'height', label: 'Tree Height', type: 'number', unit: 'm', min: 1, step: '0.1' },
    { name: 'species', label: 'Tree Type', type: 'select', options: [
      { label: 'Hardwood (e.g., oak, maple)', value: 'hardwood' },
      { label: 'Softwood (e.g., pine, fir)', value: 'softwood' },
      { label: 'Tropical hardwood', value: 'tropical' },
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
    const densityMap: Record<string, number> = { hardwood: 0.6, softwood: 0.4, tropical: 0.7 }
    const density = densityMap[v.species] || 0.5
    const r = v.dbh / 200
    const vol = Math.PI * r * r * v.height * 0.5
    const biomass = vol * density
    const carbon = biomass * 0.5
    const co2 = carbon * 3.67
    return {
      result: co2, label: 'Carbon Stored', unit: 'kg CO₂',
      steps: [
        { label: 'DBH', value: `${v.dbh} cm` },
        { label: 'Height', value: `${v.height} m` },
        { label: 'Wood density', value: `${density} g/cm³` },
        { label: 'Biomass (est.)', value: `${biomass.toFixed(1)} kg` },
        { label: 'Carbon content', value: `${carbon.toFixed(1)} kg (50% of biomass)` },
        { label: 'CO₂ equivalent', value: `${co2.toFixed(0)} kg CO₂` },
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
  description: 'Calculate the carbon stored in a single tree using diameter, height, and wood density. Urban trees provide significant carbon benefits.',
  formula: 'Volume = π × (DBH/200)² × Height × 0.5 | Biomass = Vol × Density | CO₂ = Biomass × 0.5 × 3.67',
  interpretation: 'A mature tree stores 100-1000+ kg CO₂. Hardwoods store more carbon than softwoods. Tree growth rate affects annual carbon sequestration rate.'
}

export default calcDef

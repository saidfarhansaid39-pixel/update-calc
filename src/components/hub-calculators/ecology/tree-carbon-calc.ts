import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ dbh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().optional(), species: z.string().optional() }),
  fields: [
    { name: 'dbh', label: 'Diameter at breast height (cm)', type: 'number', min: 1, step: '0.1' },
    { name: 'height', label: 'Tree height (m)', type: 'number', min: 1, step: '0.5' },
    { name: 'species', label: 'Species group', type: 'select', options: [{ label: 'Hardwood deciduous', value: 'hard' }, { label: 'Softwood conifer', value: 'soft' }, { label: 'Tropical', value: 'trop' }] },
    ],
  presets: [
    { label: 'US average', values: { miles: '12000', mpg: '25', kwh: '10800', diet: '2.5' } },
    { label: 'EU average', values: { miles: '8000', mpg: '45', kwh: '6200', diet: '2.5' } },
    { label: 'Vegan commuter', values: { miles: '5000', mpg: '30', kwh: '4000', diet: '1.5' } },
    { label: 'Large family', values: { miles: '18000', mpg: '20', kwh: '15000', diet: '3.3' } },
    { label: 'Off-grid minimal', values: { miles: '2000', mpg: '50', kwh: '1000', diet: '1.7' } }
    ],
  compute: (v) => { const d = parseFloat(v.dbh); const h = parseFloat(v.height)||d*0.8; const sp = v.species||'hard'; const fMap: Record<string, number> = { hard: 0.12, soft: 0.09, trop: 0.15 }; const f = fMap[sp]; const biomass = f * (d**2 * h) * 0.5; const carbon = biomass * 0.47; const co2 = carbon * 3.67; return { result: co2, label: 'Carbon Stored', unit: 'kg CO₂e', steps: [{ label: 'DBH', value: `${d} cm` }, { label: 'Height', value: `${h.toFixed(1)} m` }, { label: 'Above-ground biomass', value: `${biomass.toFixed(1)} kg` }, { label: 'Carbon content', value: `${carbon.toFixed(1)} kg` }, { label: 'CO₂ equivalent', value: `${co2.toFixed(0)} kg` }] ,
    extras: [
      { label: "Environmental Context", value: "Carbon accounting is essential for climate mitigation. Forests store ~45% of terrestrial carbon; soils store ~2× more than the atmosphere." },
      { label: "Measurement Method", value: "Eddy covariance flux towers, allometric equations, soil cores, remote sensing (LiDAR, satellite). IPCC guidelines provide standardized methodologies." },
      { label: "Conservation Note", value: "Protecting and restoring carbon-rich ecosystems (peatlands, mangroves, old-growth forests) provides dual climate-biodiversity benefits." },
      { label: "Typical Ranges", value: "Tropical forests: 200-400 Mg C/ha. Temperate: 100-250 Mg C/ha. Boreal: 50-150 Mg C/ha. US avg footprint: ~16 t CO₂e/person/yr." },
      { label: "Related Concepts", value: "Carbon cycle, greenhouse gas inventory, carbon credits, REDD+, net-zero, carbon sequestration potential." }
    ]} },
  description: 'Estimates carbon stored in a tree using allometric equations based on diameter and height.',
  formula: 'Biomass = f × D²H | Carbon = Biomass × 0.47 | CO₂ = C × 3.67',
  interpretation: 'A mature tree (30 cm DBH) stores ~500-1500 kg CO₂e. Younger trees store less but sequester faster.'
}

export default calcDef

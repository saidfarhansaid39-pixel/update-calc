import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ biomass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().optional(), factor: z.string().optional() }),
  fields: [
    { name: 'biomass', label: 'Aboveground biomass (Mg)', type: 'number', min: 1, step: '1' },
    { name: 'area', label: 'Forest area (ha, optional)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'factor', label: 'Carbon fraction (default 0.47)', type: 'number', min: 0.1, max: 0.6, step: '0.01' },
    ],
  presets: [
    { label: 'US average', values: { miles: '12000', mpg: '25', kwh: '10800', diet: '2.5' } },
    { label: 'EU average', values: { miles: '8000', mpg: '45', kwh: '6200', diet: '2.5' } },
    { label: 'Vegan commuter', values: { miles: '5000', mpg: '30', kwh: '4000', diet: '1.5' } },
    { label: 'Large family', values: { miles: '18000', mpg: '20', kwh: '15000', diet: '3.3' } },
    { label: 'Off-grid minimal', values: { miles: '2000', mpg: '50', kwh: '1000', diet: '1.7' } }
    ],
  compute: (v) => { const agb = parseFloat(v.biomass); const area = parseFloat(v.area)||1; const cf = parseFloat(v.factor)||0.47; const carbon = agb * cf; const co2e = carbon * 3.67; const perHa = carbon/area; return { result: perHa, label: 'Carbon Stock', unit: 'Mg C/ha', steps: [{ label: 'AG biomass', value: `${agb} Mg` }, { label: 'Area', value: `${area} ha` }, { label: 'Carbon fraction', value: cf.toFixed(2) }, { label: 'Total carbon', value: `${carbon.toFixed(1)} Mg C` }, { label: 'Per hectare', value: `${perHa.toFixed(1)} Mg C/ha` }, { label: 'CO₂ equivalent', value: `${co2e.toFixed(0)} Mg CO₂e` }] ,
    extras: [
      { label: "Environmental Context", value: "Carbon accounting is essential for climate mitigation. Forests store ~45% of terrestrial carbon; soils store ~2× more than the atmosphere." },
      { label: "Measurement Method", value: "Eddy covariance flux towers, allometric equations, soil cores, remote sensing (LiDAR, satellite). IPCC guidelines provide standardized methodologies." },
      { label: "Conservation Note", value: "Protecting and restoring carbon-rich ecosystems (peatlands, mangroves, old-growth forests) provides dual climate-biodiversity benefits." },
      { label: "Typical Ranges", value: "Tropical forests: 200-400 Mg C/ha. Temperate: 100-250 Mg C/ha. Boreal: 50-150 Mg C/ha. US avg footprint: ~16 t CO₂e/person/yr." },
      { label: "Related Concepts", value: "Carbon cycle, greenhouse gas inventory, carbon credits, REDD+, net-zero, carbon sequestration potential." }
    ]} },
  description: 'Forest carbon stock estimates the amount of carbon stored in forest biomass using conversion from aboveground biomass.',
  formula: 'Carbon = AGB × 0.47 | CO₂e = Carbon × 3.67 | Per ha = Carbon/Area',
  interpretation: 'IPCC default carbon fraction: 0.47. Tropical forests: 100-300 Mg C/ha. Temperate: 50-150 Mg C/ha. Boreal: 30-80 Mg C/ha.'
}

export default calcDef

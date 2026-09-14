import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rainfall: z.string().optional(), collectionEff: z.string().optional() }),
  fields: [
    { name: 'area', label: 'Roof area (m²)', type: 'number', min: 1, step: '1' },
    { name: 'rainfall', label: 'Annual rainfall (mm)', type: 'number', min: 0, step: '10' },
    { name: 'collectionEff', label: 'Collection efficiency (%)', type: 'number', min: 0, max: 100, step: '5' },
    ],
  presets: [
    { label: 'Piping plover nest success', values: { nests: '30', successfulNests: '12', eggsPerNest: '4' } },
    { label: 'Invasive kudzu control', values: { infestationArea: '5', treatmentEfficacy: '60', regrowthRate: '15' } },
    { label: 'Canopy cover restoration', values: { baselines: '10', quadrats: '25', canopyThreshold: '30' } },
    { label: 'Rainwater harvesting', values: { roofArea: '100', annualRainfall: '900', collectionEff: '0.8' } },
    { label: 'Nest box monitoring', values: { nestBoxes: '50', occupied: '32', fledgedPerNest: '2.5' } }
    ],
  compute: (v) => { const rain = parseFloat(v.rainfall)||800; const eff = (parseFloat(v.collectionEff)||85) / 100; const harvestL = parseFloat(v.area) * (rain / 1000) * eff * 1000; const harvestKL = harvestL / 1000; return { result: harvestKL, label: 'Annual Harvestable Rainwater', unit: 'kL', steps: [{ label: 'Catchment area', value: `${v.area} m²` }, { label: 'Annual rainfall', value: `${rain} mm` }, { label: 'Collection efficiency', value: `${(eff*100).toFixed(0)}%` }, { label: 'Harvestable volume', value: `${harvestKL.toFixed(1)} kL` }, { label: 'Daily average', value: `${(harvestL/365).toFixed(1)} L/day` }] ,
    extras: [
      { label: "Environmental Context", value: "Applied ecology translates ecological principles into practical management — from restoring degraded habitats to controlling invasive species." },
      { label: "Measurement Method", value: "Field experiments, BACI (Before-After-Control-Impact) designs, adaptive management frameworks. Monitoring data collected at regular intervals." },
      { label: "Conservation Note", value: "Nest success rates < 30% often require intervention. Invasive species control costs $120 billion/year in the US alone. Early detection is critical." },
      { label: "Typical Ranges", value: "Nest success: 20-80% (species-dependent). Canopy cover: 25-100% (forest interior). Invasive species cover >30% indicates need for control." },
      { label: "Related Concepts", value: "Adaptive management, ecological restoration, integrated pest management, early detection rapid response (EDRR), rewilding." }
    ]} },
  description: 'Estimates annual rainwater harvesting potential from rooftop catchment.',
  formula: 'Harvest (L) = Area (m²) × Rainfall (m) × Efficiency × 1000',
  interpretation: 'A 100 m² roof in 800 mm rainfall = ~68,000 L/year. Average person uses ~150 L/day.'
}

export default calcDef

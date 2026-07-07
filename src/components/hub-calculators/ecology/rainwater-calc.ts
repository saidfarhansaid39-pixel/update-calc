import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rainfall: z.string().optional(), collectionEff: z.string().optional() }),
  fields: [
    { name: 'area', label: 'Roof area (m²)', type: 'number', min: 1, step: '1' },
    { name: 'rainfall', label: 'Annual rainfall (mm)', type: 'number', min: 0, step: '10' },
    { name: 'collectionEff', label: 'Collection efficiency (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => { const rain = parseFloat(v.rainfall)||800; const eff = (parseFloat(v.collectionEff)||85) / 100; const harvestL = parseFloat(v.area) * (rain / 1000) * eff * 1000; const harvestKL = harvestL / 1000; return { result: harvestKL, label: 'Annual Harvestable Rainwater', unit: 'kL', steps: [{ label: 'Catchment area', value: `${v.area} m²` }, { label: 'Annual rainfall', value: `${rain} mm` }, { label: 'Collection efficiency', value: `${(eff*100).toFixed(0)}%` }, { label: 'Harvestable volume', value: `${harvestKL.toFixed(1)} kL` }, { label: 'Daily average', value: `${(harvestL/365).toFixed(1)} L/day` }] } },
  description: 'Estimates annual rainwater harvesting potential from rooftop catchment.',
  formula: 'Harvest (L) = Area (m²) × Rainfall (m) × Efficiency × 1000',
  interpretation: 'A 100 m² roof in 800 mm rainfall = ~68,000 L/year. Average person uses ~150 L/day.'
}

export default calcDef

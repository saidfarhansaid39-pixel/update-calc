import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ecosystem: z.string() }),
  fields: [
    { name: 'area', label: 'Ecosystem area (ha)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'ecosystem', label: 'Ecosystem type', type: 'select', options: [
      { label: 'Tropical forest', value: 'tropical' },
      { label: 'Temperate forest', value: 'temperate' },
      { label: 'Wetland / mangrove', value: 'wetland' },
      { label: 'Coral reef', value: 'coral' },
      { label: 'Grassland', value: 'grassland' },
    ] },
  ],
  compute: (v) => { const area = parseFloat(v.area); const values: Record<string,number> = { tropical: 5000, temperate: 2000, wetland: 15000, coral: 35000, grassland: 500 }; const perHa = values[v.ecosystem]||1000; const totalValue = area * perHa; return { result: totalValue, label: 'Total Ecosystem Service Value', unit: 'USD/yr', steps: [{ label: 'Ecosystem type', value: `${v.ecosystem}` }, { label: 'Area', value: `${area} ha` }, { label: 'Value per ha/yr', value: `$${perHa.toLocaleString()}/ha/yr` }, { label: 'Total annual value', value: `$${totalValue.toLocaleString()}/yr` }] } },
  description: 'Ecosystem service valuation estimates the monetary value of benefits provided by natural ecosystems, including carbon sequestration, water purification, and biodiversity.',
  formula: 'Total value = Area × Value per hectare | Values from Costanza et al. 2014',
  interpretation: 'Coral reefs and wetlands have highest per-hectare values. Tropical forests provide significant carbon and biodiversity values. Values are conservative estimates.'
}

export default calcDef

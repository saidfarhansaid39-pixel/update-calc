import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'Tropical rainforest', values: { gpp: '3500', respiration: '2500', biomassStock: '400' } },
    { label: 'Coral reef', values: { primaryProd: '2500', trophicLevels: '4', fishBiomass: '150' } },
    { label: 'Temperate lake', values: { energyInput: '800', respiration: '650', trophicEfficiency: '10' } },
    { label: 'Agricultural field', values: { npp: '1200', harvest: '800', soilCarbon: '80' } },
    { label: 'Deep ocean', values: { gpp: '150', respiration: '50', trophicEfficiency: '5' } }
    ],
  compute: (v) => { const area = parseFloat(v.area); const values: Record<string,number> = { tropical: 5000, temperate: 2000, wetland: 15000, coral: 35000, grassland: 500 }; const perHa = values[v.ecosystem]||1000; const totalValue = area * perHa; return { result: totalValue, label: 'Total Ecosystem Service Value', unit: 'USD/yr', steps: [{ label: 'Ecosystem type', value: `${v.ecosystem}` }, { label: 'Area', value: `${area} ha` }, { label: 'Value per ha/yr', value: `$${perHa.toLocaleString()}/ha/yr` }, { label: 'Total annual value', value: `$${totalValue.toLocaleString()}/yr` }] ,
    extras: [
      { label: "Environmental Context", value: "Productivity and energy transfer govern ecosystem structure. Only ~10% of energy transfers between trophic levels, limiting food web length." },
      { label: "Measurement Method", value: "Primary productivity measured via light-dark bottle method, eddy covariance, or satellite NDVI. Trophic levels determined by stable isotope analysis (δ¹⁵N)." },
      { label: "Conservation Note", value: "Ecosystem services valued at $125-140 trillion/year (2019 estimate). Intact ecosystems provide pollination, water purification, and climate regulation." },
      { label: "Typical Ranges", value: "Trophic transfer efficiency: 5-20%. NPP ranges: 0-500 (desert) to 2000-2500+ g C/m²/yr (tropical rainforest)." },
      { label: "Related Concepts", value: "Food web dynamics, ecological pyramids, keystone species, trophic cascades, ecosystem engineering, ecological stoichiometry." }
    ]} },
  description: 'Ecosystem service valuation estimates the monetary value of benefits provided by natural ecosystems, including carbon sequestration, water purification, and biodiversity.',
  formula: 'Total value = Area × Value per hectare | Values from Costanza et al. 2014',
  interpretation: 'Coral reefs and wetlands have highest per-hectare values. Tropical forests provide significant carbon and biodiversity values. Values are conservative estimates.'
}

export default calcDef

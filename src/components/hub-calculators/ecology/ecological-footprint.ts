import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ foodAcres: z.string().optional(), housingAcres: z.string().optional(), transportAcres: z.string().optional(), goodsAcres: z.string().optional() }),
  fields: [
    { name: 'foodAcres', label: 'Food footprint (global ha)', type: 'number', min: 0, step: '0.1' },
    { name: 'housingAcres', label: 'Housing footprint (global ha)', type: 'number', min: 0, step: '0.1' },
    { name: 'transportAcres', label: 'Transport footprint (global ha)', type: 'number', min: 0, step: '0.1' },
    { name: 'goodsAcres', label: 'Goods & services (global ha)', type: 'number', min: 0, step: '0.1' },
    ],
  presets: [
    { label: 'US average', values: { cropland: '0.5', pasture: '0.3', forest: '0.2', fishing: '0.1', builtUp: '0.15' } },
    { label: 'EU average', values: { cropland: '0.4', pasture: '0.15', forest: '0.25', fishing: '0.05', builtUp: '0.1' } },
    { label: 'Global average', values: { cropland: '0.3', pasture: '0.1', forest: '0.1', fishing: '0.05', builtUp: '0.05' } },
    { label: 'Developing nation', values: { cropland: '0.2', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.02' } },
    { label: 'One-planet living', values: { cropland: '0.25', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.05' } }
    ],
  compute: (v) => { const food = parseFloat(v.foodAcres)||1.2; const housing = parseFloat(v.housingAcres)||0.8; const transport = parseFloat(v.transportAcres)||0.6; const goods = parseFloat(v.goodsAcres)||0.8; const total = food + housing + transport + goods; const earths = total / 1.6; return { result: total, label: 'Ecological Footprint', unit: 'global ha', steps: [{ label: 'Food', value: `${food.toFixed(2)} gha` }, { label: 'Housing', value: `${housing.toFixed(2)} gha` }, { label: 'Transport', value: `${transport.toFixed(2)} gha` }, { label: 'Goods & services', value: `${goods.toFixed(2)} gha` }, { label: 'Total', value: `${total.toFixed(2)} gha` }, { label: 'Earths needed', value: `${earths.toFixed(2)}` }] ,
    extras: [
      { label: "Environmental Context", value: "Ecological footprint measures human demand on nature. Humanity currently uses ~1.75 Earths annually — an overshoot that depletes natural capital." },
      { label: "Measurement Method", value: "National Footprint Accounts use UN data on production, trade, and land use. Biocapacity calculated from crop, forest, grazing, and fishing area × yield factors." },
      { label: "Conservation Note", value: "Reducing per-capita footprint from 2.7 to <1.6 gha is essential for sustainability. High-income countries have 3-5× the global average footprint." },
      { label: "Typical Ranges", value: "World average: 2.7 gha/person. US: 8.1, EU: 4.5, China: 3.4, India: 1.1. Biocapacity per person declining as population grows." },
      { label: "Related Concepts", value: "Planetary boundaries, doughnut economics, one-planet living, circular economy, natural capital accounting, SDGs." }
    ]} },
  description: 'Calculates personal ecological footprint in global hectares, measuring resource demand against Earth\'s biocapacity.',
  formula: 'EF = Σ(category consumption / global yield)',
  interpretation: 'Global biocapacity: ~1.6 gha/person. Sustainable target: <2.0 gha. US average: ~8.0 gha.'
}

export default calcDef

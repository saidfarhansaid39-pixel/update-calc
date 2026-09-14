import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ total: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), recycled: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), composted: z.string().optional() }),
  fields: [
    { name: 'total', label: 'Total Waste (kg)', type: 'number', min: 1, step: '1' },
    { name: 'recycled', label: 'Recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'composted', label: 'Composted (kg)', type: 'number', min: 0, step: '1' },
    ],
  presets: [
    { label: 'US household (4 people)', values: { wasteKg: '800', recyclingRate: '32', compostingRate: '5' } },
    { label: 'EU household', values: { wasteKg: '500', recyclingRate: '48', compostingRate: '17' } },
    { label: 'Zero-waste family', values: { wasteKg: '200', recyclingRate: '70', compostingRate: '20' } },
    { label: 'High-consumer', values: { wasteKg: '1200', recyclingRate: '15', compostingRate: '2' } },
    { label: 'Restaurant', values: { wasteKg: '3000', recyclingRate: '25', compostingRate: '30' } }
    ],
  compute: (v) => { const recycled = parseFloat(v.recycled)||0; const composted = parseFloat(v.composted)||0; const diverted = recycled + composted; const rate = diverted / parseFloat(v.total) * 100; return { result: rate, label: 'Waste Diversion Rate', unit: '%', steps: [{ label: 'Total waste', value: `${v.total} kg` }, { label: 'Recycled', value: `${recycled.toFixed(0)} kg` }, { label: 'Composted', value: `${composted.toFixed(0)} kg` }, { label: 'Diverted from landfill', value: `${diverted.toFixed(0)} kg` }, { label: 'Diversion rate', value: `${rate.toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Global waste generation is ~2.1 billion tonnes/year and growing faster than population. Landfills are the third-largest source of anthropogenic methane." },
      { label: "Measurement Method", value: "Waste composition analysis, material flow analysis, diversion rate tracking. Data from municipal records, EPA/EEA reports." },
      { label: "Conservation Note", value: "Every tonne of recycled material saves 1-4 tonnes of CO₂. Composting reduces landfill methane by 50-80% and produces valuable soil amendment." },
      { label: "Typical Ranges", value: "US recycling rate: ~32%. EU: ~48%. Best performers (Germany, South Korea): >65%. Per capita waste: 0.3-1.5 kg/day globally." },
      { label: "Related Concepts", value: "Circular economy, zero waste, extended producer responsibility (EPR), waste hierarchy, cradle-to-cradle design, industrial ecology." }
    ]} },
  description: 'Calculates the percentage of waste diverted from landfill through recycling and composting.',
  formula: 'Diversion rate = (Recycled + Composted) / Total × 100%',
  interpretation: 'Zero waste goals target 90%+ diversion. US average: ~35%. EU average: ~48%.'
}

export default calcDef

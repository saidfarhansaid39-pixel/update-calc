import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ paper: z.string().optional(), plastic: z.string().optional(), glass: z.string().optional(), metal: z.string().optional() }),
  fields: [
    { name: 'paper', label: 'Paper recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'plastic', label: 'Plastic recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'glass', label: 'Glass recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'metal', label: 'Metal recycled (kg)', type: 'number', min: 0, step: '1' },
    ],
  presets: [
    { label: 'US household (4 people)', values: { wasteKg: '800', recyclingRate: '32', compostingRate: '5' } },
    { label: 'EU household', values: { wasteKg: '500', recyclingRate: '48', compostingRate: '17' } },
    { label: 'Zero-waste family', values: { wasteKg: '200', recyclingRate: '70', compostingRate: '20' } },
    { label: 'High-consumer', values: { wasteKg: '1200', recyclingRate: '15', compostingRate: '2' } },
    { label: 'Restaurant', values: { wasteKg: '3000', recyclingRate: '25', compostingRate: '30' } }
    ],
  compute: (v) => { const paper = parseFloat(v.paper)||0; const plastic = parseFloat(v.plastic)||0; const glass = parseFloat(v.glass)||0; const metal = parseFloat(v.metal)||0; const co2Saved = paper * 3.5 + plastic * 1.5 + glass * 0.6 + metal * 9.2; const total = paper + plastic + glass + metal; return { result: co2Saved, label: 'CO₂ Savings from Recycling', unit: 'kg', steps: [{ label: 'Paper recycled', value: `${paper} kg` }, { label: 'Plastic recycled', value: `${plastic} kg` }, { label: 'Glass recycled', value: `${glass} kg` }, { label: 'Metal recycled', value: `${metal} kg` }, { label: 'Total CO₂ saved', value: `${co2Saved.toFixed(1)} kg` }] ,
    extras: [
      { label: "Environmental Context", value: "Global waste generation is ~2.1 billion tonnes/year and growing faster than population. Landfills are the third-largest source of anthropogenic methane." },
      { label: "Measurement Method", value: "Waste composition analysis, material flow analysis, diversion rate tracking. Data from municipal records, EPA/EEA reports." },
      { label: "Conservation Note", value: "Every tonne of recycled material saves 1-4 tonnes of CO₂. Composting reduces landfill methane by 50-80% and produces valuable soil amendment." },
      { label: "Typical Ranges", value: "US recycling rate: ~32%. EU: ~48%. Best performers (Germany, South Korea): >65%. Per capita waste: 0.3-1.5 kg/day globally." },
      { label: "Related Concepts", value: "Circular economy, zero waste, extended producer responsibility (EPR), waste hierarchy, cradle-to-cradle design, industrial ecology." }
    ]} },
  description: 'Estimates greenhouse gas reductions achieved through recycling common materials.',
  formula: 'CO₂ saved = Σ(material × emission factor)',
  interpretation: 'Recycling 1 kg of aluminum saves ~9.2 kg CO₂e. Paper: ~3.5 kg. Glass: ~0.6 kg.'
}

export default calcDef

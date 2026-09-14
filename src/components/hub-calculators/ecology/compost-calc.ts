import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ greens: z.string().optional(), browns: z.string().optional(), volume: z.string().optional() }),
  fields: [
    { name: 'greens', label: 'Green materials (kg/week)', type: 'number', min: 0, step: '0.5' },
    { name: 'browns', label: 'Brown materials (kg/week)', type: 'number', min: 0, step: '0.5' },
    { name: 'volume', label: 'Bin volume (L)', type: 'number', min: 50, step: '10' },
    ],
  presets: [
    { label: 'US household (4 people)', values: { wasteKg: '800', recyclingRate: '32', compostingRate: '5' } },
    { label: 'EU household', values: { wasteKg: '500', recyclingRate: '48', compostingRate: '17' } },
    { label: 'Zero-waste family', values: { wasteKg: '200', recyclingRate: '70', compostingRate: '20' } },
    { label: 'High-consumer', values: { wasteKg: '1200', recyclingRate: '15', compostingRate: '2' } },
    { label: 'Restaurant', values: { wasteKg: '3000', recyclingRate: '25', compostingRate: '30' } }
    ],
  compute: (v) => { const greens = parseFloat(v.greens)||0; const browns = parseFloat(v.browns)||0; const ratio = browns > 0 ? greens / browns : 0; const vol = parseFloat(v.volume)||200; const capacityWeeks = browns > 0 ? vol / ((greens + browns) * 0.4) : 0; const status = ratio > 0.5 ? 'Too wet—add browns' : ratio < 0.2 ? 'Too dry—add greens' : 'Balanced C:N'; return { result: ratio, label: 'Greens-to-Browns Ratio', unit: '', steps: [{ label: 'Green (N-rich) per week', value: `${greens} kg` }, { label: 'Brown (C-rich) per week', value: `${browns} kg` }, { label: 'G:B ratio', value: `${ratio.toFixed(2)}` }, { label: 'Status', value: status }, ...(capacityWeeks > 0 ? [{ label: 'Bin fill time', value: `${capacityWeeks.toFixed(0)} weeks` }] : [])] ,
    extras: [
      { label: "Environmental Context", value: "Global waste generation is ~2.1 billion tonnes/year and growing faster than population. Landfills are the third-largest source of anthropogenic methane." },
      { label: "Measurement Method", value: "Waste composition analysis, material flow analysis, diversion rate tracking. Data from municipal records, EPA/EEA reports." },
      { label: "Conservation Note", value: "Every tonne of recycled material saves 1-4 tonnes of CO₂. Composting reduces landfill methane by 50-80% and produces valuable soil amendment." },
      { label: "Typical Ranges", value: "US recycling rate: ~32%. EU: ~48%. Best performers (Germany, South Korea): >65%. Per capita waste: 0.3-1.5 kg/day globally." },
      { label: "Related Concepts", value: "Circular economy, zero waste, extended producer responsibility (EPR), waste hierarchy, cradle-to-cradle design, industrial ecology." }
    ]} },
  description: 'Helps optimize compost mix by calculating the carbon-to-nitrogen balance.',
  formula: 'Target C:N ~25-30:1. G:B ratio should be ~1:2 to 1:3 by volume.',
  interpretation: 'Too many greens (N) causes odors. Too many browns (C) slows decomposition. Ideal: 1 part greens to 2-3 parts browns.'
}

export default calcDef

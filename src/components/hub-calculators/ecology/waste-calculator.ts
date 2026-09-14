import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    wasteGen: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    recycled: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= parseFloat(v) }, '0-100'),
    people: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'wasteGen', label: 'Waste Generated', type: 'number', unit: 'kg/week', min: 0.1, step: '0.1' },
    { name: 'recycled', label: 'Recycled', type: 'number', unit: '%', min: 0, max: 100, step: '1' },
    { name: 'people', label: 'Number of People', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'US household (4 people)', values: { wasteKg: '800', recyclingRate: '32', compostingRate: '5' } },
    { label: 'EU household', values: { wasteKg: '500', recyclingRate: '48', compostingRate: '17' } },
    { label: 'Zero-waste family', values: { wasteKg: '200', recyclingRate: '70', compostingRate: '20' } },
    { label: 'High-consumer', values: { wasteKg: '1200', recyclingRate: '15', compostingRate: '2' } },
    { label: 'Restaurant', values: { wasteKg: '3000', recyclingRate: '25', compostingRate: '30' } }
    ],
  compute: (v) => {
    const people = v.people || 1
    const totalWaste = v.wasteGen * 52 / people
    const recycledWaste = totalWaste * v.recycled / 100
    const landfillWaste = totalWaste - recycledWaste
    const diversionRate = v.recycled
    return {
      result: diversionRate, label: 'Diversion Rate', unit: '%',
      steps: [
        { label: 'Total annual waste', value: `${(v.wasteGen * 52).toFixed(0)} kg` },
        { label: 'Per person', value: `${totalWaste.toFixed(1)} kg/yr` },
        { label: 'Recycled', value: `${recycledWaste.toFixed(1)} kg/yr` },
        { label: 'Landfill', value: `${landfillWaste.toFixed(1)} kg/yr` },
        { label: 'Diversion rate', value: `${diversionRate.toFixed(1)}%` },
        step("US average", "~32% diversion rate"),
      ]
,
    extras: [
      { label: "Environmental Context", value: "Global waste generation is ~2.1 billion tonnes/year and growing faster than population. Landfills are the third-largest source of anthropogenic methane." },
      { label: "Measurement Method", value: "Waste composition analysis, material flow analysis, diversion rate tracking. Data from municipal records, EPA/EEA reports." },
      { label: "Conservation Note", value: "Every tonne of recycled material saves 1-4 tonnes of CO₂. Composting reduces landfill methane by 50-80% and produces valuable soil amendment." },
      { label: "Typical Ranges", value: "US recycling rate: ~32%. EU: ~48%. Best performers (Germany, South Korea): >65%. Per capita waste: 0.3-1.5 kg/day globally." },
      { label: "Related Concepts", value: "Circular economy, zero waste, extended producer responsibility (EPR), waste hierarchy, cradle-to-cradle design, industrial ecology." }
    ]}
  },
  description: 'Track waste generation, recycling rates, and landfill diversion. The average American generates ~800 kg of waste per year, with a ~32% recycling rate.',
  formula: 'Annual Waste = Weekly × 52 | Diversion Rate = Recycled / Total × 100%',
  interpretation: 'EPA target: 50% diversion. Landfills produce methane (CH₄), a potent greenhouse gas. Reducing waste and increasing recycling lowers environmental impact.'
}

export default calcDef

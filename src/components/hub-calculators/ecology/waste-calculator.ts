import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

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
        { label: 'US average', value: '~32% diversion rate' },
      ]
}
  },
  description: 'Track waste generation, recycling rates, and landfill diversion. The average American generates ~800 kg of waste per year, with a ~32% recycling rate.',
  formula: 'Annual Waste = Weekly × 52 | Diversion Rate = Recycled / Total × 100%',
  interpretation: 'EPA target: 50% diversion. Landfills produce methane (CH₄), a potent greenhouse gas. Reducing waste and increasing recycling lowers environmental impact.'
}

export default calcDef

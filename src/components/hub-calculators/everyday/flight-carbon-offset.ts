import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ flightCo2Kg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), offsetCostPerTon: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'flightCo2Kg', label: 'Flight CO₂ (kg)', type: 'number', min: 10, step: '50' },
    { name: 'offsetCostPerTon', label: 'Offset Cost per Ton ($)', type: 'number', min: 5, step: '5' },
  ],
  compute: (v) => {
    const tons = v.flightCo2Kg / 1000
    const offsetCost = tons * v.offsetCostPerTon
    const treesNeeded = Math.ceil(tons * 45)
    return { result: offsetCost, label: 'Offset Cost', unit: '$', steps: [{ label: 'CO₂ Emissions', value: `${v.flightCo2Kg.toFixed(0)} kg (${tons.toFixed(3)} tonnes)` }, { label: 'Offset Cost', value: `$${offsetCost.toFixed(2)}` }, { label: 'Trees to Plant (annual)', value: `${treesNeeded} trees` }] }
  },
  description: 'Calculate the cost to offset your flight carbon emissions through verified carbon credit programs and tree planting initiatives.',
  formula: 'Offset Cost = (CO₂ kg / 1000) × Price per Ton | Trees needed = Tonnes × 45',
  interpretation: 'Verified carbon offsets cost $10-50 per tonne CO₂. One tree absorbs ~22 kg CO₂ per year. Gold Standard and Verra are reputable offset certifications. Offsetting is a complement to, not replacement for, reducing emissions.'
}

export default calcDef

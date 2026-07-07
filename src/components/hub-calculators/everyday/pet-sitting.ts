import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pets: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), visitsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ratePerVisit: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), days: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'pets', label: 'Number of Pets', type: 'number', min: 1, step: '1' },
    { name: 'visitsPerDay', label: 'Visits per Day', type: 'number', min: 1, step: '1' },
    { name: 'ratePerVisit', label: 'Rate per Visit ($)', type: 'number', min: 10, step: '5' },
    { name: 'days', label: 'Total Days', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalVisits = v.visitsPerDay * v.days
    const totalCost = totalVisits * v.ratePerVisit
    const costPerPet = totalCost / v.pets
    return { result: totalCost, label: 'Total Pet Sitting Cost', unit: '$', steps: [{ label: 'Total Visits', value: `${totalVisits} (${v.visitsPerDay}/day × ${v.days} days)` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }, { label: 'Cost per Pet', value: `$${costPerPet.toFixed(2)}` }] }
  },
  description: 'Calculate the total cost of pet sitting services based on number of pets, visits per day, rate, and duration.',
  formula: 'Cost = Visits/Day × Days × Rate/Visit | Cost/Pet = Total ÷ Pets',
  interpretation: 'Average pet sitting rates: $15-25 per visit for dogs, $12-20 for cats. Overnight stays cost $40-75/night. Holiday rates are typically 1.5-2× standard. Most sitters charge per visit, not per pet.'
}

export default calcDef

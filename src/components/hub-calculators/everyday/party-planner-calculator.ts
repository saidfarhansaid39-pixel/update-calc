import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ guests: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), foodPerPerson: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), drinksPerPerson: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), decorations: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), venue: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), entertainment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), staffCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'guests', label: 'Number of Guests', type: 'number', min: 1, step: '5' },
    { name: 'foodPerPerson', label: 'Food Cost per Person ($)', type: 'number', min: 0, step: '5' },
    { name: 'drinksPerPerson', label: 'Drinks Cost per Person ($)', type: 'number', min: 0, step: '5' },
    { name: 'decorations', label: 'Decorations Budget ($)', type: 'number', min: 0, step: '25' },
    { name: 'venue', label: 'Venue Cost ($)', type: 'number', min: 0, step: '100' },
    { name: 'entertainment', label: 'Entertainment ($)', type: 'number', min: 0, step: '50' },
    { name: 'staffCost', label: 'Staff/Service ($)', type: 'number', min: 0, step: '50' },
  ],
  compute: (v) => { const foodTotal = v.guests * v.foodPerPerson; const drinkTotal = v.guests * v.drinksPerPerson; const totalPerGuest = foodTotal + drinkTotal; const total = foodTotal + drinkTotal + v.decorations + v.venue + v.entertainment + v.staffCost; const costPerGuest = total / v.guests; return { result: total, label: 'Total Party Cost', unit: '$', steps: [{ label: 'Food & Drinks', value: `$${foodTotal.toFixed(0)} + $${drinkTotal.toFixed(0)} = $${(foodTotal + drinkTotal).toFixed(0)}` }, { label: 'Decorations', value: `$${v.decorations.toFixed(0)}` }, { label: 'Venue', value: `$${v.venue.toFixed(0)}` }, { label: 'Entertainment & Staff', value: `$${(v.entertainment + v.staffCost).toFixed(0)}` }, { label: 'Total', value: `$${total.toFixed(0)}` }, { label: 'Cost per Guest', value: `$${costPerGuest.toFixed(2)}` }] } },
  description: 'Plan your party budget with total cost breakdown including food, drinks, venue, decorations, entertainment, and staffing per guest.',
  formula: 'Total = Guests × (Food + Drinks) + Decorations + Venue + Entertainment + Staff',
  interpretation: 'Party costs average $30-200/guest. Food is the biggest expense (40-50%). Drinks: 20-25% for open bar. Venue: 15-25%. Send invites 4-6 weeks ahead for better attendance planning.'
}

export default calcDef

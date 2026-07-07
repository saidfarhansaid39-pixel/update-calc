import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ acGuests: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), acMealType: z.string().min(1), acPerPersonRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), acServiceFeePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), acStaffCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'acGuests', label: 'Number of Guests', type: 'number', min: 1, step: '5' },
    { name: 'acMealType', label: 'Meal Type', type: 'select', options: [{ label: 'Breakfast', value: 'breakfast' }, { label: 'Lunch', value: 'lunch' }, { label: 'Dinner', value: 'dinner' }, { label: 'Cocktail Hour', value: 'cocktail' }, { label: 'Dessert Only', value: 'dessert' }] },
    { name: 'acPerPersonRate', label: 'Cost per Person ($)', type: 'number', min: 5, step: '5' },
    { name: 'acServiceFeePct', label: 'Service Fee (%)', type: 'number', min: 0, max: 30, step: '2' },
    { name: 'acStaffCount', label: 'Serving Staff Required', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const foodTotal = v.acGuests * v.acPerPersonRate
    const serviceFee = foodTotal * (v.acServiceFeePct / 100)
    const staffCost = v.acStaffCount * 150
    const subtotal = foodTotal + serviceFee + staffCost
    const tax = subtotal * 0.08
    const gratituty = foodTotal * 0.18
    const total = subtotal + tax + gratituty
    return { result: total, label: 'Total Catering Cost', unit: '$', steps: [{ label: 'Food Cost', value: `${v.acGuests} × $${v.acPerPersonRate.toFixed(2)} = $${foodTotal.toFixed(2)}` }, { label: 'Service Fee', value: `$${serviceFee.toFixed(2)}` }, { label: 'Staff Cost', value: `$${staffCost.toFixed(2)}` }, { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` }, { label: 'Gratuity (18%)', value: `$${gratituty.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }] }
  },
  description: 'Estimate total catering costs for your event including food, service fees, staff, tax, and gratuity. Get a comprehensive budget for any gathering.',
  formula: 'Total = (Guests × Per Person) + Service Fee + Staff + Tax + Gratuity | Staff = Count × $150 | Gratuity = Food × 18%',
  interpretation: 'Catering averages $15-30/person for breakfast, $20-40 for lunch, $30-80 for dinner. Budget one server per 25 guests. Confirm gratuity and service fee policies with your caterer in advance.'
}

export default calcDef

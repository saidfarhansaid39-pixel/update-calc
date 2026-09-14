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
  defaults: { acGuests: '50', acMealType: 'dinner', acPerPersonRate: '35', acServiceFeePct: '10', acStaffCount: '2' },
  presets: [
    { label: 'Breakfast Meeting (20 guests)', values: { acGuests: '20', acMealType: 'breakfast', acPerPersonRate: '18', acServiceFeePct: '8', acStaffCount: '1' } },
    { label: 'Lunch Corporate (40 guests)', values: { acGuests: '40', acMealType: 'lunch', acPerPersonRate: '28', acServiceFeePct: '10', acStaffCount: '2' } },
    { label: 'Evening Dinner Party (30 guests)', values: { acGuests: '30', acMealType: 'dinner', acPerPersonRate: '55', acServiceFeePct: '12', acStaffCount: '2' } },
    { label: 'Cocktail Reception (100 guests)', values: { acGuests: '100', acMealType: 'cocktail', acPerPersonRate: '25', acServiceFeePct: '10', acStaffCount: '4' } },
  ],
  compute: (v) => {
    const foodTotal = v.acGuests * v.acPerPersonRate
    const serviceFee = foodTotal * (v.acServiceFeePct / 100)
    const staffCost = v.acStaffCount * 150
    const subtotal = foodTotal + serviceFee + staffCost
    const tax = subtotal * 0.08
    const gratuity = foodTotal * 0.18
    const total = subtotal + tax + gratuity
    const perPerson = total / v.acGuests
    const staffRatio = v.acStaffCount > 0 ? v.acGuests / v.acStaffCount : 0
    return { result: total, label: 'Total Catering Cost', unit: '$', steps: [
      { label: '1. Food cost', value: `${v.acGuests} guests × $${v.acPerPersonRate.toFixed(2)}/pp = $${foodTotal.toFixed(2)} (${v.acMealType})` },
      { label: '2. Service fee', value: `$${foodTotal.toFixed(2)} × ${v.acServiceFeePct}% = $${serviceFee.toFixed(2)}` },
      { label: '3. Staff cost', value: `${v.acStaffCount} staff × $150 = $${staffCost.toFixed(2)}` },
      { label: '4. Subtotal (food + fees)', value: `$${foodTotal.toFixed(2)} + $${serviceFee.toFixed(2)} + $${staffCost.toFixed(2)} = $${subtotal.toFixed(2)}` },
      { label: '5. Tax (8%)', value: `$${subtotal.toFixed(2)} × 0.08 = $${tax.toFixed(2)}` },
      { label: '6. Gratuity (18% of food)', value: `$${foodTotal.toFixed(2)} × 0.18 = $${gratuity.toFixed(2)}` },
      { label: '7. Total cost', value: `$${subtotal.toFixed(2)} + $${tax.toFixed(2)} + $${gratuity.toFixed(2)} = $${total.toFixed(2)}` },
      { label: '8. Cost per guest', value: `$${total.toFixed(2)} ÷ ${v.acGuests} = $${perPerson.toFixed(2)}/person` },
    ] ,
    extras: [
      { label: "Meal Type Averages", value: "Breakfast: $15-30/pp. Lunch: $20-40/pp. Dinner: $30-80/pp. Cocktail hour (heavy apps): $20-40/pp. Dessert only: $8-15/pp. Brunch: $20-35/pp." },
      { label: "Staff-to-Guest Ratio", value: "Budget 1 server per 25 guests for plated dinners, 1 per 30 for buffets, 1 per 20 for cocktail hour with passed hors d'oeuvres. Bartender: 1 per 50 guests." },
      { label: "Service Fee vs Gratuity", value: "Service fee (5-20%) goes to the caterer for overhead. Gratuity (15-22%) goes to staff. Some venues combine both at 20-25%. Ask what's included before budgeting." },
      { label: "Seasonal Pricing", value: "Peak wedding season (May-Oct) costs 15-25% more. Holiday parties (Dec) have minimum spends. Off-season (Jan-Mar) and weekday events save 10-20%." },
      { label: "Beverage Packages", value: "Most caterers offer per-person beverage packages: non-alcoholic ($5-10), beer/wine ($15-25), full bar ($30-50). Consumption-based billing can save money for light-drinking groups." },
      { label: "Food Waste Reduction", value: "Buffets waste 20-30% of food. Plated dinners waste 5-10%. Family-style serves 10-15% waste. Order 10% less for buffets than headcount — guests take less than expected." },
      { label: "Dietary Prep", value: "Survey guests 2-3 weeks ahead for allergies and restrictions. Most caterers accommodate vegetarians/vegans/GF at no extra cost if notified. Kosher/Halal may add $5-15/pp." },
      { label: "Contract Fine Print", value: "Check cancellation policy, overtime fees ($200-500/hr past end time), corkage fees ($15-35/bottle if bringing your own wine), and cleanup fees — these add up quickly." },
    ]}
  },
  description: 'Estimate total event catering costs including food, service fees, staff wages, tax, and gratuity. Per-guest breakdown for breakfast, lunch, dinner, or cocktail events.',
  formula: 'Total = (Food × (1 + Fee%) + Staff) × 1.08 + Food × 0.18 | Per Person = Total ÷ Guests | Staff Ratio = Guests ÷ Staff',
  interpretation: 'Dinner averages $30-80/pp. Budget 1 server per 25 guests. Gratuity (18%) + service fee (8-12%) add 26-30% to food cost. Off-season and weekday events save 10-20%.'
}

export default calcDef

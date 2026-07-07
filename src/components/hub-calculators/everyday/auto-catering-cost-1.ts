import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ accGuestCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accMenuTier: z.string().min(1), accBarOption: z.string().min(1), accHourCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), accDessertIncluded: z.string().min(1) }),
  fields: [
    { name: 'accGuestCount', label: 'Guest Count', type: 'number', min: 1, step: '5' },
    { name: 'accMenuTier', label: 'Menu Tier', type: 'select', options: [{ label: 'Budget ($15/pp)', value: 'budget' }, { label: 'Standard ($30/pp)', value: 'standard' }, { label: 'Premium ($55/pp)', value: 'premium' }, { label: 'Luxury ($85/pp)', value: 'luxury' }] },
    { name: 'accBarOption', label: 'Bar Service', type: 'select', options: [{ label: 'No Bar (BYO)', value: 'none' }, { label: 'Beer & Wine ($12/pp)', value: 'beer-wine' }, { label: 'Full Bar ($25/pp)', value: 'full' }, { label: 'Premium Bar ($40/pp)', value: 'premium' }] },
    { name: 'accHourCount', label: 'Event Duration (hours)', type: 'number', min: 1, step: '1' },
    { name: 'accDessertIncluded', label: 'Dessert Course', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const menuCosts: Record<string, number> = { budget: 15, standard: 30, premium: 55, luxury: 85 }
    const barCosts: Record<string, number> = { none: 0, 'beer-wine': 12, full: 25, premium: 40 }
    const menuRate = menuCosts[v.accMenuTier] || 30
    const barRate = barCosts[v.accBarOption] || 0
    const dessertSurcharge = v.accDessertIncluded === 'yes' ? v.accGuestCount * 8 : 0
    const foodTotal = v.accGuestCount * menuRate
    const barTotal = v.accGuestCount * barRate * (v.accHourCount / 3)
    const venueRent = v.accGuestCount * 5
    const subtotal = foodTotal + barTotal + dessertSurcharge + venueRent
    const tax = subtotal * 0.09
    const total = subtotal + tax
    return { result: total, label: 'Total Event Catering', unit: '$', steps: [{ label: 'Menu', value: `${v.accGuestCount} × $${menuRate} = $${foodTotal.toFixed(0)}` }, { label: 'Bar', value: `$${barTotal.toFixed(0)}` }, { label: 'Dessert Surcharge', value: `$${dessertSurcharge.toFixed(0)}` }, { label: 'Venue Surcharge', value: `$${venueRent.toFixed(0)}` }, { label: 'Subtotal', value: `$${subtotal.toFixed(0)}` }, { label: 'Tax (9%)', value: `$${tax.toFixed(0)}` }, { label: 'Total', value: `$${total.toFixed(0)}` }] }
  },
  description: 'Plan your event catering budget with menu tier, bar service, dessert, and venue surcharges. Compare budget to luxury catering options.',
  formula: 'Total = (Menu + Bar × Hours/3 + Dessert + Venue) × 1.09',
  interpretation: 'Bar service typically accounts for 25-35% of catering cost. Hourly bar pricing assumes 2 drinks per guest for the first 3 hours. Dessert courses add $5-10/guest. Book at least 2-3 weeks in advance.'
}

export default calcDef

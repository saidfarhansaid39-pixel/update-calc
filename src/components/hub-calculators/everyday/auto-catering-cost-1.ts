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
  defaults: { accGuestCount: '50', accMenuTier: 'standard', accBarOption: 'full', accHourCount: '4', accDessertIncluded: 'yes' },
  presets: [
    { label: 'Birthday Party (30 guests)', values: { accGuestCount: '30', accMenuTier: 'standard', accBarOption: 'beer-wine', accHourCount: '3', accDessertIncluded: 'yes' } },
    { label: 'Wedding Reception (100 guests)', values: { accGuestCount: '100', accMenuTier: 'premium', accBarOption: 'full', accHourCount: '5', accDessertIncluded: 'yes' } },
    { label: 'Corporate Lunch (20 guests)', values: { accGuestCount: '20', accMenuTier: 'budget', accBarOption: 'none', accHourCount: '2', accDessertIncluded: 'no' } },
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
    const perPerson = total / v.accGuestCount
    const barPct = (barTotal / subtotal) * 100
    return { result: total, label: 'Total Event Catering', unit: '$', steps: [
      { label: '1. Food cost', value: `${v.accGuestCount} × $${menuRate} = $${foodTotal.toFixed(0)} (${v.accMenuTier} tier)` },
      { label: '2. Bar service', value: `${v.accGuestCount} × $${barRate} × (${v.accHourCount}h ÷ 3) = $${barTotal.toFixed(0)}` },
      { label: '3. Dessert course', value: v.accDessertIncluded === 'yes' ? `${v.accGuestCount} × $8 = $${dessertSurcharge.toFixed(0)}` : '$0 (not included)' },
      { label: '4. Venue surcharge', value: `${v.accGuestCount} × $5 = $${venueRent.toFixed(0)}` },
      { label: '5. Subtotal', value: `$${foodTotal.toFixed(0)} + $${barTotal.toFixed(0)} + $${dessertSurcharge.toFixed(0)} + $${venueRent.toFixed(0)} = $${subtotal.toFixed(0)}` },
      { label: '6. Tax (9%)', value: `$${subtotal.toFixed(0)} × 0.09 = $${tax.toFixed(0)}` },
      { label: '7. Total cost', value: `$${subtotal.toFixed(0)} + $${tax.toFixed(0)} = $${total.toFixed(0)}` },
      { label: '8. Cost per guest', value: `$${total.toFixed(0)} ÷ ${v.accGuestCount} = $${perPerson.toFixed(2)}/person` },
    ] ,
    extras: [
      { label: "Bar Cost Breakdown", value: "Bar typically accounts for 25-35% of catering cost. Full bar for 4 hours costs $25-40/person. Beer & wine only saves 40-50% vs full bar. Cash bars reduce your cost to $0." },
      { label: "Catering Per-Person Averages", value: "Budget buffet: $15-25. Standard plated: $30-50. Premium plated: $55-85. Luxury/custom: $85-150+. Hors d'oeuvres only: $20-40/pp for cocktail events." },
      { label: "Service & Gratuity", value: "Most caterers add 18-22% gratuity + 7-10% service fee. Confirm what's included. Some venues require their own in-house catering at premium rates." },
      { label: "Timing Strategy", value: "Breakfast/brunch catering costs 20-30% less than dinner. Lunch is 10-15% less. Shorter events (2-3 hrs) reduce bar and staffing costs significantly." },
      { label: "Menu Customization", value: "Offering 2-3 entrée choices costs 10-15% more than a single menu. Plated dinners cost more than buffets but reduce food waste (typically 10% vs 25% for buffet)." },
      { label: "Dietary Accommodations", value: "Expect 10-20% of guests with dietary restrictions (vegetarian, vegan, gluten-free, allergies). Most caterers accommodate without extra charge if notified 1-2 weeks ahead." },
      { label: "Booking Timeline", value: "Book popular caterers 3-6 months ahead for weddings, 2-4 weeks for corporate events. Off-season (Jan-Mar, July-Aug) rates are 10-20% lower." },
      { label: "Tasting & Contracts", value: "Always schedule a tasting before booking. Get everything in writing: menu, staffing ratio (1 server per 25 guests), bar pricing model (per drink vs per person), and cancellation policy." },
    ]}
  },
  description: 'Plan your event catering budget with menu tier, bar service, dessert course, and venue surcharges. Breaks down food, bar, tax, and per-guest cost.',
  formula: 'Total = (Food + (Bar × Hours/3) + Dessert + Venue) × 1.09 | Per Person = Total ÷ Guests',
  interpretation: 'Budget $15-85/person for food plus $12-40/person for bar over 3 hrs. Bar = 25-35% of total. Plated costs more than buffet but wastes less. Book 2-4 weeks ahead for corporate, 3-6 months for weddings.'
}

export default calcDef

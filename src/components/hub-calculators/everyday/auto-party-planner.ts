import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ appGuestCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), appPartyType: z.string().min(1), appFoodPerPerson: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), appDrinksPerPerson: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), appDurationHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), appDecorBudget: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), appEntertainmentCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'appGuestCount', label: 'Number of Guests', type: 'number', min: 1, step: '5' },
    { name: 'appPartyType', label: 'Party Type', type: 'select', options: [{ label: 'Birthday', value: 'birthday' }, { label: 'Holiday', value: 'holiday' }, { label: 'BBQ/Cookout', value: 'bbq' }, { label: 'Game Night', value: 'game' }, { label: 'Cocktail Party', value: 'cocktail' }, { label: 'Potluck', value: 'potluck' }] },
    { name: 'appFoodPerPerson', label: 'Food Budget per Person ($)', type: 'number', min: 1, step: '5' },
    { name: 'appDrinksPerPerson', label: 'Drinks Budget per Person ($)', type: 'number', min: 0, step: '5' },
    { name: 'appDurationHours', label: 'Event Duration (hours)', type: 'number', min: 1, step: '1' },
    { name: 'appDecorBudget', label: 'Decorations Budget ($)', type: 'number', min: 0, step: '20' },
    { name: 'appEntertainmentCost', label: 'Entertainment Cost ($)', type: 'number', min: 0, step: '50' },
  ],
  defaults: { appGuestCount: '10', appPartyType: 'birthday', appFoodPerPerson: '15', appDrinksPerPerson: '10', appDurationHours: '3', appDecorBudget: '50', appEntertainmentCost: '100' },
  presets: [
    { label: 'Birthday Party', values: { appGuestCount: '10', appPartyType: 'birthday', appFoodPerPerson: '18', appDrinksPerPerson: '12', appDurationHours: '3', appDecorBudget: '60', appEntertainmentCost: '120' } },
    { label: 'BBQ Cookout', values: { appGuestCount: '20', appPartyType: 'bbq', appFoodPerPerson: '12', appDrinksPerPerson: '8', appDurationHours: '5', appDecorBudget: '40', appEntertainmentCost: '80' } },
    { label: 'Cocktail Party', values: { appGuestCount: '15', appPartyType: 'cocktail', appFoodPerPerson: '25', appDrinksPerPerson: '18', appDurationHours: '2', appDecorBudget: '100', appEntertainmentCost: '50' } },
    { label: 'Game Night', values: { appGuestCount: '8', appPartyType: 'game', appFoodPerPerson: '10', appDrinksPerPerson: '5', appDurationHours: '4', appDecorBudget: '20', appEntertainmentCost: '0' } },
  ],
  compute: (v) => {
    const foodTotal = v.appGuestCount * v.appFoodPerPerson
    const drinkTotal = v.appGuestCount * v.appDrinksPerPerson
    const venueCost = v.appGuestCount * 5
    const totalDirect = foodTotal + drinkTotal + v.appDecorBudget + v.appEntertainmentCost + venueCost
    const cleanupCost = v.appGuestCount * 2
    const miscPct = 0.05
    const totalBeforeMisc = totalDirect + cleanupCost
    const miscBuffer = totalBeforeMisc * miscPct
    const grandTotal = totalBeforeMisc + miscBuffer
    const perPerson = grandTotal / v.appGuestCount
    return { result: grandTotal, label: 'Total Party Budget', unit: '$', steps: [
      { label: 'Food Cost', value: `${v.appGuestCount} guests × $${v.appFoodPerPerson}/guest = $${foodTotal.toFixed(2)}` },
      { label: 'Drinks Cost', value: `${v.appGuestCount} guests × $${v.appDrinksPerPerson}/guest = $${drinkTotal.toFixed(2)}` },
      { label: 'Decor + Entertainment', value: `$${v.appDecorBudget.toFixed(2)} + $${v.appEntertainmentCost.toFixed(2)} = $${(v.appDecorBudget + v.appEntertainmentCost).toFixed(2)}` },
      { label: 'Venue/Tableware', value: `${v.appGuestCount} guests × $5.00/guest = $${venueCost.toFixed(2)}` },
      { label: 'Cleanup Fee', value: `${v.appGuestCount} guests × $2.00/guest = $${cleanupCost.toFixed(2)}` },
      { label: 'Subtotal', value: `$${foodTotal.toFixed(2)} + $${drinkTotal.toFixed(2)} + $${(v.appDecorBudget + v.appEntertainmentCost + venueCost).toFixed(2)} + $${cleanupCost.toFixed(2)} = $${totalBeforeMisc.toFixed(2)}` },
      { label: 'Contingency (5%)', value: `$${totalBeforeMisc.toFixed(2)} × 0.05 = $${miscBuffer.toFixed(2)}` },
      { label: 'Grand Total', value: `$${totalBeforeMisc.toFixed(2)} + $${miscBuffer.toFixed(2)} = $${grandTotal.toFixed(2)}` },
      { label: 'Per Person', value: `$${grandTotal.toFixed(2)} ÷ ${v.appGuestCount} = $${perPerson.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Per-person budget guide", value: "Budget $15–30/person for food, $5–20 for drinks. For a 3-hour party, plan 6–8 appetizer items. Potluck: ask for 1 dish per 2 guests." },
      { label: "Timing matters", value: "Shorter parties (2–3 hrs) need less food and drink volume. A cocktail party at 2 hrs might serve 4–6 hors d'oeuvres per person; a 5-hr BBQ needs full meals." },
      { label: "Venue savings", value: "Hosting at home saves $5–15/guest in venue fees. If using a rental, ask about BYO decor and cleanup waivers to cut costs by 20–30%." },
      { label: "Entertainment on a budget", value: "DIY playlists (free), board games (already owned), and photo booth props ($20) can replace a $200+ DJ. For game nights, entertainment cost is often $0." },
      { label: "Leftover planning", value: "For BBQs and potlucks, expect 15–20% leftovers. Send guests home with containers or plan for next-day meals to reduce food waste." },
      { label: "Dietary accommodations", value: "Assume 10–15% of guests have dietary restrictions. Offer 1–2 vegetarian/gluten-free options and clearly label dishes for safety." },
      { label: "Seasonal pricing", value: "Summer BBQ ingredients (produce, meats) are 10–25% cheaper. Holiday and birthday party supplies cost 20–40% more in December." },
      { label: "Cleanup crew", value: "Hiring a cleaning service ($50–150) is worth it for 20+ guests. Otherwise, enlist 2–3 friends to help for 30 minutes after." },
    ]}
  },
  description: 'Plan any party budget with precision — calculate food, drinks, decor, entertainment, venue, cleanup, and a 5% contingency buffer. Get the per-person cost and total event budget in seconds.',
  formula: 'Total = GuestCount × (FoodPP + DrinksPP + $7) + Decor + Entertainment | Contingency = Subtotal × 1.05 | PerPerson = GrandTotal ÷ GuestCount',
  interpretation: 'A 10-guest birthday with dinner and drinks: ~$400–600 total ($40–60/person). A 20-person BBQ: ~$500–700 ($25–35/person). A 2-hr cocktail party for 15: ~$700–1,000 ($45–65/person). The 5% contingency covers last-minute plate runs, extra ice, and snack refills.'
}

export default calcDef

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
    return { result: grandTotal, label: 'Total Party Budget', unit: '$', steps: [{ label: 'Food', value: `${v.appGuestCount} × $${v.appFoodPerPerson} = $${foodTotal.toFixed(2)}` }, { label: 'Drinks', value: `$${drinkTotal.toFixed(2)}` }, { label: 'Decor + Entertainment', value: `$${(v.appDecorBudget + v.appEntertainmentCost).toFixed(2)}` }, { label: 'Venue/Tableware', value: `$${venueCost.toFixed(2)}` }, { label: 'Cleanup', value: `$${cleanupCost.toFixed(2)}` }, { label: 'Misc Buffer (5%)', value: `$${miscBuffer.toFixed(2)}` }, { label: 'Grand Total', value: `$${grandTotal.toFixed(2)}` }] }
  },
  description: 'Auto party planner that calculates a complete event budget including food, drinks, decor, entertainment, venue, and a contingency buffer.',
  formula: 'Total = (Food + Drinks + Decor + Entertainment + Venue + Cleanup) × 1.05 | Per Person = Total / Guests',
  interpretation: 'Budget $15-30/person for food, $5-20 for drinks. A 3-hour party needs ~6-8 appetizer items. For potluck, plan for 1 dish per 2 guests. Always add a 5% contingency buffer for unexpected costs.'
}

export default calcDef

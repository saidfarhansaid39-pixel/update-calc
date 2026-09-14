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
  defaults: { guests: '30', foodPerPerson: '25', drinksPerPerson: '15', decorations: '100', venue: '500', entertainment: '300', staffCost: '200' },
  presets: [
    { label: 'Birthday Party (20 guests)', values: { guests: '20', foodPerPerson: '20', drinksPerPerson: '10', decorations: '75', venue: '0', entertainment: '150', staffCost: '0' } },
    { label: 'Wedding Reception (100 guests)', values: { guests: '100', foodPerPerson: '60', drinksPerPerson: '30', decorations: '1000', venue: '3000', entertainment: '2000', staffCost: '1500' } },
    { label: 'BBQ Gathering (15 guests)', values: { guests: '15', foodPerPerson: '15', drinksPerPerson: '8', decorations: '25', venue: '0', entertainment: '0', staffCost: '0' } },
    { label: 'Holiday Party (50 guests)', values: { guests: '50', foodPerPerson: '35', drinksPerPerson: '20', decorations: '200', venue: '1000', entertainment: '500', staffCost: '400' } },
  ],
  compute: (v) => { const foodTotal = v.guests * v.foodPerPerson; const drinkTotal = v.guests * v.drinksPerPerson; const foodAndDrink = foodTotal + drinkTotal; const total = foodAndDrink + v.decorations + v.venue + v.entertainment + v.staffCost; const costPerGuest = total / v.guests; const foodPct = total > 0 ? (foodTotal / total) * 100 : 0; const drinkPct = total > 0 ? (drinkTotal / total) * 100 : 0; const venuePct = total > 0 ? (v.venue / total) * 100 : 0; return { result: total, label: 'Total Party Cost', unit: '$',
    steps: [
      { label: 'Food Cost', value: `${v.guests} guests × $${v.foodPerPerson} = $${foodTotal.toFixed(0)}` },
      { label: 'Drinks Cost', value: `${v.guests} guests × $${v.drinksPerPerson} = $${drinkTotal.toFixed(0)}` },
      { label: 'Food & Drinks Subtotal', value: `$${foodTotal.toFixed(0)} + $${drinkTotal.toFixed(0)} = $${foodAndDrink.toFixed(0)}` },
      { label: 'Decorations', value: `$${v.decorations.toFixed(0)}` },
      { label: 'Venue Cost', value: `$${v.venue.toFixed(0)}` },
      { label: 'Entertainment + Staff', value: `$${v.entertainment.toFixed(0)} + $${v.staffCost.toFixed(0)} = $${(v.entertainment + v.staffCost).toFixed(0)}` },
      { label: 'Total Party Cost', value: `$${foodAndDrink.toFixed(0)} + $${v.decorations.toFixed(0)} + $${v.venue.toFixed(0)} + $${(v.entertainment + v.staffCost).toFixed(0)} = $${total.toFixed(0)}` },
      { label: 'Cost per Guest', value: `$${total.toFixed(0)} ÷ ${v.guests} = $${costPerGuest.toFixed(2)}` },
      { label: 'Budget Breakdown', value: `Food ${foodPct.toFixed(0)}% | Drinks ${drinkPct.toFixed(0)}% | Venue ${venuePct.toFixed(0)}% | Other ${(100 - foodPct - drinkPct - venuePct).toFixed(0)}%` },
    ],
    extras: [
      { label: '🎉 Average Party Cost by Type', value: 'Casual BBQ: $10-25/guest. Birthday party: $25-60/guest. Holiday party: $40-80/guest. Cocktail party: $30-70/guest. Wedding reception: $100-300/guest. Corporate event: $75-200/guest.' },
      { label: '🍔 Food Cost Ratios', value: 'Food is the largest expense (40-50% of total budget). Catering averages: buffet $12-25/person, plated dinner $25-60/person, appetizers only $8-15/person. Hiring a private chef for home parties is trending — $40-80/person.' },
      { label: '🥂 Drinks Cost Planning', value: 'Open bar: $25-45/person (3-4 hours). Beer & wine only: $15-25/person. Cash bar: guests pay per drink (saves 50%+ but can feel less welcoming). Signature cocktail: 1-2 drinks pre-made saves 20-30% vs full open bar.' },
      { label: '📅 Timing Affects Costs', value: 'Weekend evening events cost 25-50% more than weekday lunch. Summer and December are peak party season — book venues 2-6 months ahead. Off-peak (Jan-Mar, Mon-Thu) can save 20-40% on venue and vendors.' },
      { label: '👥 Guest Count Strategy', value: 'Expect 75-85% attendance rate for local events, 60-75% for destination. Send save-the-dates 4-8 weeks ahead. RSVP deadline 2 weeks before. Build a buffer of 10% for no-shows on food/drink budget.' },
      { label: '🎵 Entertainment by Budget', value: 'DIY playlist (free). Bluetooth speaker ($100-300). DJ ($500-2,000). Live band ($1,500-5,000). Photo booth ($300-800). Magician/comedian ($300-1,500). Entertainment is 5-15% of total party budget typically.' },
      { label: '🛋️ Saved Money: At-Home Party', value: 'Hosting at home saves $500-3,000 on venue. Park/public space rental: $100-500. Community center: $200-800. Restaurant private room: often $0 fee with minimum food/drink spend ($500-2,000 minimum).' },
      { label: '📋 Party Planning Timeline', value: '8 weeks: set budget, pick date. 6 weeks: book venue, send invites. 4 weeks: book caterer, DJ, rentals. 2 weeks: confirm headcount, order decorations. 1 week: shopping, prep. 1 day: setup.' },
    ]
  } },
  description: 'Plan your party or event budget with a full cost breakdown including food, drinks, venue, decorations, entertainment, and staffing. Get per-guest costs and budget allocation percentages.',
  formula: 'Food = Guests × Food/Person | Drinks = Guests × Drinks/Person | Total = Food + Drinks + Decorations + Venue + Entertainment + Staff | Cost/Guest = Total ÷ Guests | Budget % = (Category ÷ Total) × 100',
  interpretation: 'Party costs vary widely by type: casual events from $10-25/guest to weddings at $100-300+/guest. The typical budget breakdown: food 40-50%, drinks 15-25%, venue 15-25%, decorations 5-10%, entertainment 5-15%. Hosting at home saves $500-3,000 on venue costs. Expect 75-85% attendance for local events. Send invitations 4-6 weeks ahead. The biggest cost-saving strategy is limiting the guest list — each additional guest adds food, drink, and potentially venue and staffing costs. For every 10 guests you cut, you save roughly $200-500 on a typical party.'
}

export default calcDef

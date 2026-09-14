import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vbcFlights: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vbcHotel: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vbcNights: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vbcCarRental: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vbcGas: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vbcFood: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vbcDays: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'vbcFlights', label: 'Flights ($)', type: 'number', min: 0, step: '100' },
    { name: 'vbcHotel', label: 'Hotel/Night ($)', type: 'number', min: 0, step: '50' },
    { name: 'vbcNights', label: 'Nights', type: 'number', min: 0, step: '1' },
    { name: 'vbcCarRental', label: 'Car Rental ($)', type: 'number', min: 0, step: '50' },
    { name: 'vbcGas', label: 'Gas/Tolls ($)', type: 'number', min: 0, step: '20' },
    { name: 'vbcFood', label: 'Food per Day ($)', type: 'number', min: 0, step: '20' },
    { name: 'vbcDays', label: 'Trip Days', type: 'number', min: 1, step: '1' },
  ],
  defaults: { vbcFlights: '400', vbcHotel: '150', vbcNights: '5', vbcCarRental: '300', vbcGas: '80', vbcFood: '60', vbcDays: '6' },
  presets: [
    { label: 'Romantic Weekend Getaway', values: { vbcFlights: '300', vbcHotel: '200', vbcNights: '2', vbcCarRental: '150', vbcGas: '40', vbcFood: '80', vbcDays: '3' } },
    { label: 'Family Beach Week', values: { vbcFlights: '1000', vbcHotel: '180', vbcNights: '6', vbcCarRental: '350', vbcGas: '60', vbcFood: '100', vbcDays: '7' } },
    { label: 'Road Trip Budget', values: { vbcFlights: '0', vbcHotel: '120', vbcNights: '4', vbcCarRental: '0', vbcGas: '200', vbcFood: '50', vbcDays: '5' } },
  ],
  compute: (v) => {
    const flights = v.vbcFlights
    const lodging = v.vbcNights * v.vbcHotel
    const transport = v.vbcCarRental + v.vbcGas
    const food = v.vbcDays * v.vbcFood
    const subtotal = flights + lodging + transport + food
    const misc = subtotal * 0.1
    const total = subtotal + misc
    const perDay = total / v.vbcDays
    const pctFlights = total > 0 ? (flights / total) * 100 : 0
    const pctLodging = total > 0 ? (lodging / total) * 100 : 0
    const pctTransport = total > 0 ? (transport / total) * 100 : 0
    const pctFood = total > 0 ? (food / total) * 100 : 0
    return { result: total, label: 'Total Vacation Cost', unit: '$', steps: [{ label: 'Flights', value: `$${flights.toFixed(2)} (${pctFlights.toFixed(0)}%)` }, { label: 'Lodging', value: `${v.vbcNights} nights × $${v.vbcHotel.toFixed(2)} = $${lodging.toFixed(2)} (${pctLodging.toFixed(0)}%)` }, { label: 'Transport (rental + gas)', value: `$${transport.toFixed(2)} (${pctTransport.toFixed(0)}%)` }, { label: 'Food & Drinks', value: `${v.vbcDays} days × $${v.vbcFood.toFixed(2)} = $${food.toFixed(2)} (${pctFood.toFixed(0)}%)` }, { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` }, { label: 'Miscellaneous Buffer (10%)', value: `+$${misc.toFixed(2)}` }, { label: 'Total Trip Cost', value: `$${total.toFixed(2)}` }, { label: 'Cost per Day', value: `$${perDay.toFixed(2)}/day` }] ,
    extras: [
      { label: 'Booking Timing Savings', value: 'Book flights 2-3 months ahead for best domestic fares (save 15-25%). International: 4-6 months ahead. Tuesday/Wednesday flights: 10-20% cheaper. Incognito browser doesn\'t actually lower prices. Set price alerts on multiple booking platforms.' },
      { label: 'Lodging Cost Strategies', value: 'Hotels near city center cost 30-50% more but save $15-30/day in transit. Airbnb/vacation rentals: cheaper for groups, include kitchen (saves $20-40/day on food). Booking direct: may get perks (free breakfast, upgrade). Last-minute apps (HotelTonight): 20-40% off unsold rooms.' },
      { label: 'All-Inclusive vs DIY', value: 'All-inclusive resorts: $300-600/night per couple (includes food, drinks, activities). DIY trip: similar total cost but more flexibility. Break-even: if you would spend $150-200/day on food + drinks, all-inclusive makes sense for heavy eaters/drinkers.' },
      { label: 'Hidden Trip Costs', value: 'Common unplanned costs: travel insurance (4-10% of trip), airport parking ($10-30/day), baggage fees ($30-60 each way), resort fees ($20-50/night), tips (15-20% of food/activities), souvenirs ($50-200), visa fees ($20-160). Add 15-20% buffer beyond the 10% here.' },
      { label: 'Transportation Comparison', value: 'Rental car: $30-80/day + gas + insurance. Rideshare (all trip): 2-4× rental cost for longer trips. Public transit: $2-5/day per person. For cities with good transit (NYC, London, Tokyo): skip rental. For road trips: rental is essential.' },
      { label: 'Food Budget Guidelines', value: 'Budget travel: $20-30/day (street food, grocery meals). Mid-range: $50-80/day (casual restaurants, one nice meal). Luxury: $100-200+/day (fine dining, wine). Eat like a local — neighborhood restaurants are 30-50% cheaper than tourist areas.' },
      { label: 'Trip Cancellation Protection', value: 'Travel insurance: 4-10% of total trip cost. Covers trip cancellation, medical emergencies, lost baggage, delays. Credit card travel insurance: many premium cards include basic coverage. For domestic trips under $1,000: self-insure (risk is manageable).' },
    ]}
  },
  description: 'Plan your vacation budget with detailed cost breakdown across flights, lodging, transportation, food, and a 10% miscellaneous buffer. Get category percentages and per-day cost for accurate trip planning.',
  formula: 'Total = Flights + (Nights × HotelRate) + (CarRental + Gas) + (Days × FoodDaily) + 10% Misc. PerDay = Total ÷ Days. Category% = CategoryCost ÷ Total × 100.',
  interpretation: 'A 6-day, 5-night trip with $400 flights, $150/night hotel, $300 rental + $80 gas, and $60/day food totals: flights $400 (19%), lodging $750 (35%), transport $380 (18%), food $360 (17%), misc $189 (9%) = $2,079 total ($347/day). Lodging is typically the largest cost category (30-40% of total), followed by flights (20-30% for fly destinations). Booking 2-3 months ahead saves 15-25% on flights. Choosing accommodations with free breakfast saves $10-20/person/day on food. The 10% misc buffer covers tips, parking, snacks, and unexpected expenses — if you don\'t use it, you come home under budget.'
}

export default calcDef

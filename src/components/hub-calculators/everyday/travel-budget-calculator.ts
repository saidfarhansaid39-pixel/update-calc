import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trvDestination: z.string().min(1), trvDays: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trvTravelers: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), trvFlights: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), trvHotelPerNight: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), trvFoodPerDay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), trvActivities: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'trvDestination', label: 'Destination Type', type: 'select', options: [{ label: 'Domestic (US)', value: 'domestic' }, { label: 'International (Europe)', value: 'europe' }, { label: 'International (Asia)', value: 'asia' }, { label: 'International (Latin America)', value: 'latam' }, { label: 'All-Inclusive Resort', value: 'resort' }] },
    { name: 'trvDays', label: 'Trip Duration (days)', type: 'number', min: 1, step: '1' },
    { name: 'trvTravelers', label: 'Number of Travelers', type: 'number', min: 1, step: '1' },
    { name: 'trvFlights', label: 'Total Flight Cost ($)', type: 'number', min: 0, step: '100' },
    { name: 'trvHotelPerNight', label: 'Hotel/Night ($)', type: 'number', min: 0, step: '50' },
    { name: 'trvFoodPerDay', label: 'Food Budget/Day ($)', type: 'number', min: 0, step: '20' },
    { name: 'trvActivities', label: 'Activities/Excursions ($)', type: 'number', min: 0, step: '100' },
  ],
  defaults: { trvDestination: 'domestic', trvDays: '7', trvTravelers: '2', trvFlights: '600', trvHotelPerNight: '150', trvFoodPerDay: '50', trvActivities: '300' },
  presets: [
    { label: 'Domestic Road Trip (7 days)', values: { trvDestination: 'domestic', trvDays: '7', trvTravelers: '2', trvFlights: '0', trvHotelPerNight: '130', trvFoodPerDay: '45', trvActivities: '250' } },
    { label: 'Europe Vacation (10 days)', values: { trvDestination: 'europe', trvDays: '10', trvTravelers: '2', trvFlights: '1400', trvHotelPerNight: '180', trvFoodPerDay: '70', trvActivities: '500' } },
    { label: 'Beach Resort (5 days)', values: { trvDestination: 'resort', trvDays: '5', trvTravelers: '2', trvFlights: '800', trvHotelPerNight: '250', trvFoodPerDay: '100', trvActivities: '200' } },
    { label: 'Backpacking Asia (14 days)', values: { trvDestination: 'asia', trvDays: '14', trvTravelers: '1', trvFlights: '900', trvHotelPerNight: '40', trvFoodPerDay: '20', trvActivities: '150' } },
  ],
  compute: (v) => {
    const flights = v.trvFlights
    const nights = v.trvDays - 1
    const lodging = nights * v.trvHotelPerNight
    const food = v.trvDays * v.trvFoodPerDay * v.trvTravelers
    const activities = v.trvActivities
    const miscBuffer = (lodging + food + activities) * 0.1
    const subtotal = flights + lodging + food + activities
    const total = subtotal + miscBuffer
    const perPerson = total / v.trvTravelers
    const perDay = total / v.trvDays
    return { result: total, label: 'Total Trip Budget', unit: '$', steps: [
      { label: 'Formula', value: 'Total = Flights + (Nights × Hotel) + (Days × Food × Travelers) + Activities + 10% Buffer' },
      { label: 'Flights', value: '$' + flights.toFixed(2) + ' (total for ' + v.trvTravelers + ')' },
      { label: 'Lodging', value: v.trvDays + ' days = ' + nights + ' nights × $' + v.trvHotelPerNight.toFixed(2) + ' = $' + lodging.toFixed(2) },
      { label: 'Food', value: v.trvDays + ' days × $' + v.trvFoodPerDay.toFixed(2) + ' × ' + v.trvTravelers + ' people = $' + food.toFixed(2) },
      { label: 'Activities', value: '$' + activities.toFixed(2) },
      { label: 'Misc Buffer (10%)', value: '$' + miscBuffer.toFixed(2) },
      { label: 'Total', value: '$' + total.toFixed(2) },
      { label: 'Per Person', value: '$' + perPerson.toFixed(2) },
      { label: 'Per Day', value: '$' + perDay.toFixed(2) },
    ] ,
    extras: [
      { label: 'Flight Timing', value: 'Book flights 6-8 weeks in advance for best domestic deals, 10-12 weeks for international. Tuesday/Wednesday cheapest' },
      { label: 'Lodging Hacks', value: 'Use aggregators (Kayak, Hotels.com) then book direct — many hotels price-match and include perks like free breakfast' },
      { label: 'Travel Insurance', value: 'Trip insurance costs 4-10% of total trip value. For international trips over $2,000, it\'s strongly recommended' },
      { label: 'Currency Exchange', value: 'Avoid airport currency exchange — rates are 5-10% worse. Use local ATMs or credit cards with no foreign transaction fees' },
      { label: 'Free Activities', value: 'Walking tours (free/pay-what-you-want), public museums (free days), and hiking trails save $20-50/day per person' },
      { label: 'Seasonal Pricing', value: 'High season costs 30-60% more. Shoulder season (Apr-May, Sep-Oct) offers best balance of weather and price' },
      { label: 'Rewards Points', value: 'A travel rewards card with sign-up bonus ($500-750 value) can cover 1-2 domestic flights or 3-5 hotel nights' },
      { label: 'Packing Strategy', value: 'Carry-on only saves $60-80 round trip in checked bag fees per person. Pack 3-4 days of clothes and do laundry' },
    ]}
  },
  description: 'Plan your complete travel budget including flights, lodging, food, activities, and a 10% contingency buffer. Supports domestic and international destinations with per-person and per-day cost breakdowns.',
  formula: 'Total = Flights + ((Days - 1) × Hotel) + (Days × Food × Travelers) + Activities × 1.1. Per Person = Total ÷ Travelers. Per Day = Total ÷ Days.',
  interpretation: 'A typical 7-day domestic trip for two costs ~$2,200-3,500: flights $600, lodging $900 (6 nights × $150), food $700 (7 days × $50 × 2), activities $300, misc $250. Flight costs dominate for international travel (30-40% of budget), while lodging dominates domestic trips. Always maintain a 10% buffer for unexpected expenses.'
}

export default calcDef

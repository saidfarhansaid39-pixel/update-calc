import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tripDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripGasPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripHotelNights: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tripHotelRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tripFoodPerDay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tripDays: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'tripDist', label: 'Total Drive Distance (mi)', type: 'number', min: 10, step: '50' },
    { name: 'tripMpg', label: 'Vehicle MPG', type: 'number', min: 5, step: '1' },
    { name: 'tripGasPrice', label: 'Gas Price per Gallon ($)', type: 'number', min: 1, step: '0.5' },
    { name: 'tripHotelNights', label: 'Hotel Nights', type: 'number', min: 0, step: '1' },
    { name: 'tripHotelRate', label: 'Hotel Rate per Night ($)', type: 'number', min: 0, step: '25' },
    { name: 'tripFoodPerDay', label: 'Daily Food Budget ($)', type: 'number', min: 0, step: '10' },
    { name: 'tripDays', label: 'Trip Duration (days)', type: 'number', min: 1, step: '1' },
  ],
  defaults: { tripDist: '1000', tripMpg: '28', tripGasPrice: '3.50', tripHotelNights: '2', tripHotelRate: '150', tripFoodPerDay: '50', tripDays: '3' },
  presets: [
    { label: 'Weekend Getaway (300 mi)', values: { tripDist: '300', tripMpg: '30', tripGasPrice: '3.50', tripHotelNights: '1', tripHotelRate: '120', tripFoodPerDay: '60', tripDays: '2' } },
    { label: 'Family Road Trip (1,500 mi)', values: { tripDist: '1500', tripMpg: '25', tripGasPrice: '3.75', tripHotelNights: '4', tripHotelRate: '180', tripFoodPerDay: '80', tripDays: '6' } },
    { label: 'Cross-Country (3,000 mi)', values: { tripDist: '3000', tripMpg: '32', tripGasPrice: '3.25', tripHotelNights: '8', tripHotelRate: '130', tripFoodPerDay: '45', tripDays: '10' } },
    { label: 'Day Trip (150 mi)', values: { tripDist: '150', tripMpg: '28', tripGasPrice: '3.60', tripHotelNights: '0', tripHotelRate: '0', tripFoodPerDay: '30', tripDays: '1' } },
  ],
  compute: (v) => {
    const gallons = v.tripDist / v.tripMpg
    const gasCost = gallons * v.tripGasPrice
    const lodging = v.tripHotelNights * v.tripHotelRate
    const food = v.tripDays * v.tripFoodPerDay
    const misc = (gasCost + lodging + food) * 0.08
    const total = gasCost + lodging + food + misc
    const perDay = total / v.tripDays
    const costPerMile = total / v.tripDist
    return { result: total, label: 'Total Trip Cost', unit: '$', steps: [
      { label: 'Formula', value: 'Total = Fuel + Lodging + Food + Misc (8%)' },
      { label: 'Fuel Cost', value: v.tripDist + ' mi ÷ ' + v.tripMpg + ' MPG × $' + v.tripGasPrice.toFixed(2) + ' = $' + gasCost.toFixed(2) },
      { label: 'Lodging', value: v.tripHotelNights + ' nights × $' + v.tripHotelRate.toFixed(2) + ' = $' + lodging.toFixed(2) },
      { label: 'Food', value: v.tripDays + ' days × $' + v.tripFoodPerDay.toFixed(2) + ' = $' + food.toFixed(2) },
      { label: 'Misc (8%)', value: '($' + gasCost.toFixed(2) + ' + $' + lodging.toFixed(2) + ' + $' + food.toFixed(2) + ') × 0.08 = $' + misc.toFixed(2) },
      { label: 'Total', value: '$' + total.toFixed(2) },
      { label: 'Per Day', value: '$' + perDay.toFixed(2) },
      { label: 'Cost per Mile', value: '$' + costPerMile.toFixed(2) + '/mi' },
    ] ,
    extras: [
      { label: 'Gas Budget Rule', value: 'Gas typically accounts for ~25-35% of total trip cost. At 28 MPG and $3.50/gal, it costs $0.125/mile' },
      { label: 'Hotel Points', value: 'Using hotel loyalty points can save $100-200/night. Sign up for free rewards programs before booking' },
      { label: 'Meal Planning', value: 'Packing a cooler with snacks saves $15-25/day per person vs eating at roadside restaurants' },
      { label: 'Off-Season Savings', value: 'Traveling in shoulder season (spring/fall) saves 20-40% on lodging and 15-30% on attractions' },
      { label: 'Tolls Add Up', value: 'Budget an extra $0.05-0.15/mile for toll roads. A 1,000 mi trip could have $50-150 in tolls' },
      { label: 'Vehicle Wear', value: 'Factor $0.05-0.10/mile for tire wear and maintenance — a 3,000 mi trip costs $150-300 in wear' },
      { label: 'Gas Apps', value: 'Use GasBuddy or Upside to save $0.10-0.25/gal — that\'s $10-25 savings on a 1,000 mi trip' },
      { label: 'EV Road Trip', value: 'EV charging costs $0.04-0.12/mi vs $0.10-0.18/mi for gas. Plan charging stops every 150-250 mi' },
    ]}
  },
  description: 'Calculate your complete road trip cost including fuel, lodging, food, and a 8% miscellaneous buffer. Essential for budgeting vacations, weekend getaways, and cross-country drives.',
  formula: 'Total = (Distance ÷ MPG × Gas Price) + (Nights × Hotel Rate) + (Days × Food/Day) × 1.08. Per Day = Total ÷ Days. Cost Per Mile = Total ÷ Distance.',
  interpretation: 'A typical 3-day, 1,000 mi road trip for two costs ~$500-800: gas $125 (28 MPG, $3.50/gal), lodging $300 (2 nights × $150), food $150 (3 days × $50), misc $46. Budget $150-250/day for comfort-level travel. Using hotel points and packing meals can reduce costs by 25-40%.'
}

export default calcDef

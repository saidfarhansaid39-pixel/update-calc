import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), nightsHotel: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hotelNightly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), foodDaily: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), days: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'distance', label: 'Total Distance (mi)', type: 'number', min: 50, step: '50' },
    { name: 'mpg', label: 'Vehicle MPG', type: 'number', min: 10, step: '5' },
    { name: 'gasPrice', label: 'Gas Price ($/gal)', type: 'number', min: 1, step: '0.5' },
    { name: 'days', label: 'Trip Duration (days)', type: 'number', min: 1, step: '1' },
    { name: 'nightsHotel', label: 'Hotel Nights', type: 'number', min: 0, step: '1' },
    { name: 'hotelNightly', label: 'Hotel Cost per Night ($)', type: 'number', min: 0, step: '50' },
    { name: 'foodDaily', label: 'Daily Food Budget ($)', type: 'number', min: 0, step: '20' },
  ],
  defaults: { distance: '800', mpg: '28', gasPrice: '3.5', days: '4', nightsHotel: '3', hotelNightly: '120', foodDaily: '50' },
  presets: [
    { label: 'Weekend Getaway', values: { distance: '300', mpg: '30', gasPrice: '3.5', days: '2', nightsHotel: '1', hotelNightly: '100', foodDaily: '40' } },
    { label: 'Cross-Country Trip', values: { distance: '3000', mpg: '28', gasPrice: '3.5', days: '10', nightsHotel: '9', hotelNightly: '120', foodDaily: '50' } },
    { label: 'National Park Tour', values: { distance: '1500', mpg: '25', gasPrice: '3.8', days: '7', nightsHotel: '6', hotelNightly: '150', foodDaily: '45' } },
    { label: 'Budget Camper Van', values: { distance: '500', mpg: '18', gasPrice: '3.5', days: '5', nightsHotel: '0', hotelNightly: '0', foodDaily: '30' } },
  ],
  compute: (v) => {
    const gasGallons = v.distance / v.mpg
    const gasCost = gasGallons * v.gasPrice
    const hotelCost = v.nightsHotel * v.hotelNightly
    const foodCost = v.days * v.foodDaily
    const total = gasCost + hotelCost + foodCost
    const costPerDay = total / v.days
    return { result: total, label: 'Total Trip Cost', unit: '$', steps: [{ label: 'Gas', value: `${gasGallons.toFixed(1)} gal × $${v.gasPrice.toFixed(2)} = $${gasCost.toFixed(2)}` }, { label: 'Lodging', value: `$${hotelCost.toFixed(2)}` }, { label: 'Food', value: `$${foodCost.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Cost per Day', value: `$${costPerDay.toFixed(2)}` }] ,
    extras: [
      { label: 'Typical Cost Breakdown', value: 'Gas: 30-40% of trip cost. Lodging: 35-45%. Food: 15-25%. Activities/souvenirs/misc: 5-15%. Budget additional $25-50/day for attractions, parking, and incidentals' },
      { label: 'Gas Savings Tips', value: 'Drive 60-65 mph saves 15-20% on fuel vs 75-80 mph. Use cruise control on highways. Check tire pressure (low pressure reduces MPG by 3%). Remove roof rack when not needed (reduces drag 10-20%)' },
      { label: 'Lodging Savings', value: 'Budget motels (Motel 6, Super 8): $50-80/night. Mid-range (Hilton, Marriott): $100-200/night. Airbnb: $80-150/night. Book 2-3 weeks ahead for best rates. Hotel rewards points: earn 10-30 free nights/year' },
      { label: 'Food Budget Realities', value: 'Fast food: $10-15/person/day. Casual dining: $25-40/person/day. Mix of groceries + eating out: $30-50/person/day. Cooler with snacks/drinks saves $10-20/day vs convenience stores' },
      { label: 'Hidden Trip Costs', value: 'Tolls: $20-100+ depending on route (Northeast, toll roads). Parking: $10-40/day in cities. National park entry: $20-35/vehicle. State parks: $5-15/vehicle. Activities: $30-100+/person for major attractions' },
      { label: 'Vehicle Preparation', value: 'Pre-trip check: oil, tires, brakes, coolant, wipers. Emergency kit: first aid, flashlight, jumper cables, blanket, water, snacks. Join AAA ($60-100/yr) for roadside assistance on long trips' },
      { label: 'Seasonal Price Variations', value: 'Gas prices: 20-40 cents/gal higher in summer (June-August). Hotels: peak summer rates 30-60% higher than off-season. Book shoulder season (May, September) for best balance of weather and price' },
    ]}
  },
  description: 'Plan your complete road trip budget: calculate total cost including fuel, lodging, and meals. Get daily cost breakdown for accurate vacation planning.',
  formula: 'TotalCost = (Distance ÷ MPG × GasPrice) + (HotelNights × NightlyRate) + (Days × DailyFoodBudget). CostPerDay = TotalCost ÷ Days.',
  interpretation: 'A 4-day, 800-mile road trip with 28 MPG vehicle at $3.50/gal gas, 3 hotel nights at $120/night, and $50/day food costs: gas = $100 (28.6 gal), lodging = $360 (51.4%), food = $200 (28.6%), total = $660, cost per day = $165. For a 10-day, 3,000-mile cross-country trip: gas = $375, lodging = $1,080, food = $500, total = $1,955, per day = $195.50. Budget tip: gas costs drop significantly with fuel-efficient vehicles — an EV charging vs gas SUV saves $200-400 on a long trip. Always budget 15-20% extra for unexpected expenses.'
}

export default calcDef

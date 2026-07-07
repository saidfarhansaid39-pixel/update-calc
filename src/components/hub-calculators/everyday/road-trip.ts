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
  compute: (v) => {
    const gasGallons = v.distance / v.mpg
    const gasCost = gasGallons * v.gasPrice
    const hotelCost = v.nightsHotel * v.hotelNightly
    const foodCost = v.days * v.foodDaily
    const total = gasCost + hotelCost + foodCost
    const costPerDay = total / v.days
    return { result: total, label: 'Total Trip Cost', unit: '$', steps: [{ label: 'Gas', value: `${gasGallons.toFixed(1)} gal × $${v.gasPrice.toFixed(2)} = $${gasCost.toFixed(2)}` }, { label: 'Lodging', value: `$${hotelCost.toFixed(2)}` }, { label: 'Food', value: `$${foodCost.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Cost per Day', value: `$${costPerDay.toFixed(2)}` }] }
  },
  description: 'Estimate total road trip cost including gas, lodging, and food expenses. Plan your driving vacation budget accurately.',
  formula: 'Total = (Distance/MPG × GasPrice) + (Nights×HotelRate) + (Days×FoodBudget)',
  interpretation: 'Gas is typically 30-40% of road trip costs. Lodging 35-45%, food 15-25%. Budget $50-75/night for motels, $100-200 for hotels. Save by packing snacks, booking ahead, and using hotel rewards points.'
}

export default calcDef

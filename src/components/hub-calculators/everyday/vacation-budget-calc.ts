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
  compute: (v) => {
    const flights = v.vbcFlights
    const lodging = v.vbcNights * v.vbcHotel
    const transport = v.vbcCarRental + v.vbcGas
    const food = v.vbcDays * v.vbcFood
    const subtotal = flights + lodging + transport + food
    const misc = subtotal * 0.1
    const total = subtotal + misc
    const perDay = total / v.vbcDays
    return { result: total, label: 'Total Vacation Cost', unit: '$', steps: [{ label: 'Flights', value: '$' + flights.toFixed(2) }, { label: 'Lodging', value: v.vbcNights + ' nights x $' + v.vbcHotel.toFixed(2) + ' = $' + lodging.toFixed(2) }, { label: 'Transport', value: '$' + transport.toFixed(2) }, { label: 'Food', value: v.vbcDays + ' days x $' + v.vbcFood.toFixed(2) + ' = $' + food.toFixed(2) }, { label: 'Misc (10%)', value: '$' + misc.toFixed(2) }, { label: 'Total', value: '$' + total.toFixed(2) }, { label: 'Per Day', value: '$' + perDay.toFixed(2) }] }
  },
  description: 'Plan your vacation budget with flight, hotel, car rental, gas, and daily food costs. Includes a 10% miscellaneous buffer.',
  formula: 'Total = Flights + (Nights x Hotel) + CarRental + Gas + (Days x Food) + 10% | PerDay = Total / Days',
  interpretation: 'Booking flights 2-3 months ahead saves 15-25%. Hotels near city center cost more but save on transport. All-inclusive resorts simplify budgeting. Set aside 10% for unexpected expenses, tips, and incidentals.'
}

export default calcDef

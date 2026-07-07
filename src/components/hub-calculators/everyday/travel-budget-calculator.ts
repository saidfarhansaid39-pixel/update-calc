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
    return { result: total, label: 'Total Trip Budget', unit: '$', steps: [{ label: 'Flights', value: '$' + flights.toFixed(2) }, { label: 'Lodging (' + nights + ' nights)', value: '$' + lodging.toFixed(2) }, { label: 'Food', value: '$' + food.toFixed(2) }, { label: 'Activities', value: '$' + activities.toFixed(2) }, { label: 'Misc Buffer (10%)', value: '$' + miscBuffer.toFixed(2) }, { label: 'Total', value: '$' + total.toFixed(2) }, { label: 'Per Person', value: '$' + perPerson.toFixed(2) }] }
  },
  description: 'Plan your complete travel budget including flights, lodging, food, activities, and a contingency buffer for unexpected costs.',
  formula: 'Total = Flights + (Nights x Hotel) + (Days x Food x Travelers) + Activities + 10% Buffer | PerPerson = Total / Travelers',
  interpretation: 'Budget breakdown: flights 30-40%, lodging 25-35%, food 15-20%, activities 10-15%, misc 10%. Domestic trip (7 days): $1,500-3,000/person. International (10 days): $2,500-5,000/person. Buffer at least 10%.'
}

export default calcDef

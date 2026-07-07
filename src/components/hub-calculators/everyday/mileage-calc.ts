import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelUsed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelUnit: z.string().min(1), fuelPrice: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'distance', label: 'Distance Traveled', type: 'number', min: 1, step: '10' },
    { name: 'fuelUsed', label: 'Fuel Used', type: 'number', min: 0.1, step: '1' },
    { name: 'fuelUnit', label: 'Unit System', type: 'select', options: [{ label: 'Miles / US Gallons', value: 'us' }, { label: 'Kilometers / Liters', value: 'metric' }] },
    { name: 'fuelPrice', label: 'Price per Gallon/Liter ($)', type: 'number', min: 0.01, step: '0.1' },
  ],
  compute: (v) => {
    let mpg: number, costPerMile: number, tripCost: number
    if (v.fuelUnit === 'us') {
      mpg = v.distance / v.fuelUsed
      costPerMile = v.fuelPrice / mpg
      tripCost = v.fuelUsed * v.fuelPrice
    } else {
      mpg = (v.distance / v.fuelUsed) * 2.35215
      costPerMile = v.fuelPrice / (v.distance / v.fuelUsed)
      tripCost = v.fuelUsed * v.fuelPrice
    }
    return { result: mpg, label: 'Fuel Efficiency', unit: v.fuelUnit === 'us' ? 'MPG' : 'MPG (equiv)', steps: [{ label: 'Fuel Efficiency', value: `${mpg.toFixed(1)} ${v.fuelUnit === 'us' ? 'MPG' : 'L/100km'} ` }, { label: 'Cost per Mile/km', value: `$${costPerMile.toFixed(3)}` }, { label: 'Trip Fuel Cost', value: `$${tripCost.toFixed(2)}` }] }
  },
  description: 'Calculate vehicle fuel efficiency (MPG) and trip costs based on distance traveled and fuel consumed.',
  formula: 'MPG = Miles / Gallons | Cost/Mile = Price/Gallon / MPG | Trip Cost = Gallons × Price',
  interpretation: 'US average: 25 MPG. Higher MPG = better efficiency. For metric: L/100km = 235.215 / MPG. Fuel costs significantly impact monthly budget — consider carpooling or EV alternatives.'
}

export default calcDef

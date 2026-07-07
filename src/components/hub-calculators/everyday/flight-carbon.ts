import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ flightDistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distanceUnit: z.string().min(1), flightClass: z.string().min(1), numPassengers: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'flightDistance', label: 'Flight Distance', type: 'number', min: 10, step: '100' },
    { name: 'distanceUnit', label: 'Distance Unit', type: 'select', options: [{ label: 'Miles', value: 'mi' }, { label: 'Kilometers', value: 'km' }] },
    { name: 'flightClass', label: 'Travel Class', type: 'select', options: [{ label: 'Economy', value: 'economy' }, { label: 'Premium Economy', value: 'premium' }, { label: 'Business', value: 'business' }, { label: 'First', value: 'first' }] },
    { name: 'numPassengers', label: 'Number of Passengers', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const distKm = v.distanceUnit === 'mi' ? v.flightDistance * 1.609 : v.flightDistance
    const classMultipliers: Record<string, number> = { economy: 1, premium: 1.5, business: 3, first: 4 }
    const multiplier = classMultipliers[v.flightClass as keyof typeof classMultipliers] || 1
    const co2PerKm = 0.115 * multiplier
    const totalCo2 = distKm * co2PerKm * v.numPassengers
    return { result: totalCo2, label: 'CO₂ Emissions', unit: 'kg', steps: [{ label: 'Distance', value: `${distKm.toFixed(0)} km` }, { label: 'Class Factor', value: `${multiplier}×` }, { label: 'CO₂ per Passenger', value: `${(distKm * co2PerKm).toFixed(0)} kg` }, { label: 'Total CO₂', value: `${totalCo2.toFixed(0)} kg` }] }
  },
  description: 'Calculate the carbon footprint of air travel based on distance, travel class, and number of passengers.',
  formula: 'CO₂ (kg) = Distance(km) × 0.115 × Class Multiplier × Passengers',
  interpretation: 'A round-trip NYC-London flight emits ~1.6 tonnes CO₂ per economy passenger. Business class emits 3× more due to larger seat footprint. Aviation accounts for ~2.5% of global CO₂ emissions.'
}

export default calcDef

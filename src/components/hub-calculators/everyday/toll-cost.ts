import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tlcRouteLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tlcTollRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tlcFixedTolls: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tlcAxles: z.string().min(1).refine(v => parseFloat(v) >= 2, '>=2'), tlcMonthlyTrips: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), tlcCarType: z.string().min(1) }),
  fields: [
    { name: 'tlcRouteLength', label: 'Route Length (mi)', type: 'number', min: 1, step: '5' },
    { name: 'tlcTollRate', label: 'Rate per Mile ($)', type: 'number', min: 0, step: '0.05' },
    { name: 'tlcFixedTolls', label: 'Fixed Tolls on Route ($)', type: 'number', min: 0, step: '1' },
    { name: 'tlcAxles', label: 'Number of Axles', type: 'number', min: 2, step: '1' },
    { name: 'tlcMonthlyTrips', label: 'Round Trips per Month', type: 'number', min: 1, step: '5' },
    { name: 'tlcCarType', label: 'Vehicle Class', type: 'select', options: [{ label: 'Car/SUV (2-axle)', value: 'car' }, { label: 'Truck (3+ axles, 1.5x)', value: 'truck' }, { label: 'Motorcycle (0.5x)', value: 'moto' }] },
  ],
  compute: (v) => {
    let axleMultiplier = 1
    if (v.tlcCarType === 'moto') axleMultiplier = 0.5
    else if (v.tlcAxles >= 3) axleMultiplier = 1.5
    const distanceToll = v.tlcRouteLength * v.tlcTollRate * axleMultiplier
    const perTrip = distanceToll + v.tlcFixedTolls
    const monthly = perTrip * v.tlcMonthlyTrips * 2
    const annual = monthly * 12
    return { result: perTrip, label: 'One-Way Toll Cost', unit: '$', steps: [{ label: 'Distance Toll', value: '$' + distanceToll.toFixed(2) }, { label: 'Fixed Tolls', value: '$' + v.tlcFixedTolls.toFixed(2) }, { label: 'One-Way Total', value: '$' + perTrip.toFixed(2) }, { label: 'Monthly (round trips)', value: '$' + monthly.toFixed(2) }, { label: 'Annual', value: '$' + annual.toFixed(2) }] }
  },
  description: 'Calculate toll costs for any route including distance-based rates, fixed tolls, axle count, and vehicle class multipliers.',
  formula: 'OneWay = (Distance x Rate x VehicleMult) + FixedTolls | Monthly = OneWay x Trips x 2 | Annual = Monthly x 12',
  interpretation: 'Trucks with 3+ axles pay 1.5-3x base toll rates. Motorcycles often pay 0.5x. Commuters spending $5/day on tolls pay $1,300/year. Annual passes or commuter plans can save 15-30% for frequent users.'
}

export default calcDef

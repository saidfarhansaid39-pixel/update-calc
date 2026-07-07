import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tcDistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tcRatePerMile: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tcTollBridges: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tcBridgeToll: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tcPassDiscount: z.string().min(1), tcTripsPerMonth: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'tcDistance', label: 'Trip Distance (mi)', type: 'number', min: 1, step: '5' },
    { name: 'tcRatePerMile', label: 'Toll Rate per Mile ($)', type: 'number', min: 0, step: '0.05' },
    { name: 'tcTollBridges', label: 'Toll Bridges/Tunnels', type: 'number', min: 0, step: '1' },
    { name: 'tcBridgeToll', label: 'Bridge/Tunnel Toll ($)', type: 'number', min: 0, step: '1' },
    { name: 'tcPassDiscount', label: 'Pass/Tag Discount', type: 'select', options: [{ label: 'No pass (full price)', value: 'none' }, { label: '10% Discount (EZ-Pass)', value: 'ezpass' }] },
    { name: 'tcTripsPerMonth', label: 'Trips per Month', type: 'number', min: 1, step: '5' },
  ],
  compute: (v) => {
    const distanceToll = v.tcDistance * v.tcRatePerMile
    const bridgeToll = v.tcTollBridges * v.tcBridgeToll
    const subtotal = distanceToll + bridgeToll
    const discountFactor = v.tcPassDiscount === 'none' ? 1 : 0.9
    const perTrip = subtotal * discountFactor
    const monthly = perTrip * v.tcTripsPerMonth
    const annual = monthly * 12
    return { result: perTrip, label: 'Toll Cost per Trip', unit: '$', steps: [{ label: 'Distance Toll', value: v.tcDistance + ' mi x $' + v.tcRatePerMile.toFixed(2) + ' = $' + distanceToll.toFixed(2) }, { label: 'Bridge/Tunnel', value: '$' + bridgeToll.toFixed(2) }, { label: 'Pass Discount', value: discountFactor < 1 ? '-10%' : 'None' }, { label: 'Per Trip', value: '$' + perTrip.toFixed(2) }, { label: 'Monthly', value: '$' + monthly.toFixed(2) }, { label: 'Annual', value: '$' + annual.toFixed(2) }] }
  },
  description: 'Calculate toll costs per trip, monthly, and annually including distance-based tolls, bridges, and electronic pass discounts.',
  formula: 'PerTrip = (Distance x Rate + Bridges x Toll) x Discount | Monthly = PerTrip x Trips | Annual = Monthly x 12',
  interpretation: 'Typical toll rates: $0.05-0.30/mile on turnpikes. Bridges: $1-8 each way. EZ-Pass saves 10-30%. Commuting 20 mi each way with tolls costs $100-300/month. Carpool lanes often have reduced tolls or are free.'
}

export default calcDef

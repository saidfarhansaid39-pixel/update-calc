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
  defaults: { tcDistance: '30', tcRatePerMile: '0.10', tcTollBridges: '0', tcBridgeToll: '0', tcPassDiscount: 'none', tcTripsPerMonth: '20' },
  presets: [
    { label: 'Turnpike Commuter (30 mi)', values: { tcDistance: '30', tcRatePerMile: '0.10', tcTollBridges: '0', tcBridgeToll: '0', tcPassDiscount: 'ezpass', tcTripsPerMonth: '22' } },
    { label: 'Bridge + Tunnel (15 mi)', values: { tcDistance: '15', tcRatePerMile: '0.05', tcTollBridges: '2', tcBridgeToll: '4', tcPassDiscount: 'none', tcTripsPerMonth: '20' } },
    { label: 'Weekend Trip (60 mi)', values: { tcDistance: '60', tcRatePerMile: '0.15', tcTollBridges: '1', tcBridgeToll: '3', tcPassDiscount: 'ezpass', tcTripsPerMonth: '4' } },
    { label: 'Cross-City (10 mi)', values: { tcDistance: '10', tcRatePerMile: '0.20', tcTollBridges: '1', tcBridgeToll: '6', tcPassDiscount: 'none', tcTripsPerMonth: '44' } },
  ],
  compute: (v) => {
    const distanceToll = v.tcDistance * v.tcRatePerMile
    const bridgeToll = v.tcTollBridges * v.tcBridgeToll
    const subtotal = distanceToll + bridgeToll
    const discountFactor = v.tcPassDiscount === 'none' ? 1 : 0.9
    const perTrip = subtotal * discountFactor
    const monthly = perTrip * v.tcTripsPerMonth
    const annual = monthly * 12
    return { result: perTrip, label: 'Toll Cost per Trip', unit: '$', steps: [
      { label: 'Formula', value: 'PerTrip = (Dist × Rate + Bridges × Toll) × Discount' },
      { label: 'Distance Toll', value: v.tcDistance + ' mi × $' + v.tcRatePerMile.toFixed(2) + ' = $' + distanceToll.toFixed(2) },
      { label: 'Bridge/Tunnel', value: v.tcTollBridges + ' × $' + v.tcBridgeToll.toFixed(2) + ' = $' + bridgeToll.toFixed(2) },
      { label: 'Pass Discount', value: discountFactor < 1 ? '-10% (EZ-Pass)' : 'No pass (full price)' },
      { label: 'Per Trip', value: '$' + perTrip.toFixed(2) },
      { label: 'Monthly', value: perTrip.toFixed(2) + ' × ' + v.tcTripsPerMonth + ' = $' + monthly.toFixed(2) },
      { label: 'Annual', value: '$' + annual.toFixed(2) },
    ] ,
    extras: [
      { label: 'Regional Rates', value: 'Turnpikes: $0.05-0.30/mi. Major bridges (Bay Bridge, GW, Verrazzano): $5-9. Tunnels (Holland, Lincoln): $10-17' },
      { label: 'EZ-Pass Savings', value: 'EZ-Pass saves 10-30% vs pay-by-plate/mail. No transponder? You pay 30-50% more in some states (NY, NJ, FL)' },
      { label: 'Peak vs Off-Peak', value: 'Many toll agencies charge 25-50% less during off-peak hours (before 6 AM, after 10 AM, before 3 PM, after 7 PM)' },
      { label: 'Carpool Discount', value: 'HOV 2+ or 3+ lanes: often free or 50-75% reduced toll. Check local HOV requirements — some require 3+ persons' },
      { label: 'Prepaid Plans', value: 'Some states offer prepaid toll plans with 5-15% bonus credit. E.g., put $50 on your pass, get $55 in toll credit' },
      { label: 'Rental Car Warning', value: 'Rental car toll passes charge $3-10/day fee + tolls. Using your own transponder in a rental is often cheaper' },
      { label: 'Tax Deductibility', value: 'Tolls for business travel are tax-deductible. Commuting tolls are NOT deductible (personal expense)' },
      { label: 'Navigation Apps', value: 'Google Maps, Waze, and Apple Maps now show toll costs in route options — compare toll vs free routes before driving' },
    ]}
  },
  description: 'Calculate toll costs per trip, monthly, and annually including distance-based tolls, bridge/tunnel charges, and electronic pass discounts. Essential for commuters and frequent toll road users.',
  formula: 'Per Trip = (Distance × Rate/Mile + Bridges × Bridge Toll) × Pass Discount. Monthly = Per Trip × Trips/Month. Annual = Monthly × 12. EZ-Pass discount: 10% off subtotal.',
  interpretation: 'A 30-mile turnpike commute at $0.10/mi with EZ-Pass costs $2.70/trip, $118.80/month (22 trips), and $1,425.60/year. A bridge-and-tunnel commute with 2 bridges at $4 each adds $8/trip on top of distance tolls. Electronic passes are the cheapest way to pay; pay-by-plate adds surcharges. Off-peak commuting can cut toll costs by 25-50%.'
}

export default calcDef

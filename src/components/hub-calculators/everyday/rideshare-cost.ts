import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), baseFare: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), perMile: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), perMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), timeMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), surge: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), tipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'distance', label: 'Trip Distance (mi)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'baseFare', label: 'Base Fare ($)', type: 'number', min: 0, step: '0.5' },
    { name: 'perMile', label: 'Per Mile Rate ($)', type: 'number', min: 0.5, step: '0.1' },
    { name: 'perMin', label: 'Per Minute Rate ($)', type: 'number', min: 0.1, step: '0.05' },
    { name: 'timeMin', label: 'Trip Duration (min)', type: 'number', min: 1, step: '5' },
    { name: 'surge', label: 'Surge Multiplier', type: 'number', min: 1, max: 5, step: '0.5' },
    { name: 'tipPct', label: 'Tip (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  defaults: { distance: '6', baseFare: '2.5', perMile: '1.5', perMin: '0.25', timeMin: '15', surge: '1', tipPct: '15' },
  presets: [
    { label: 'Airport Run', values: { distance: '15', baseFare: '2.5', perMile: '1.5', perMin: '0.25', timeMin: '25', surge: '1.5', tipPct: '20' } },
    { label: 'Night Out Downtown', values: { distance: '4', baseFare: '2', perMile: '1.8', perMin: '0.3', timeMin: '12', surge: '2', tipPct: '20' } },
    { label: 'Commute to Work', values: { distance: '8', baseFare: '2', perMile: '1.2', perMin: '0.2', timeMin: '20', surge: '1', tipPct: '15' } },
    { label: 'Pool/Share Ride', values: { distance: '6', baseFare: '1', perMile: '0.9', perMin: '0.15', timeMin: '30', surge: '1', tipPct: '15' } },
  ],
  compute: (v) => {
    const subtotal = (v.baseFare + v.perMile * v.distance + v.perMin * v.timeMin) * v.surge
    const tip = subtotal * (v.tipPct / 100)
    const total = subtotal + tip
    return { result: total, label: 'Total Fare with Tip', unit: '$', steps: [{ label: 'Distance Charge', value: `$${(v.perMile * v.distance).toFixed(2)}` }, { label: 'Time Charge', value: `$${(v.perMin * v.timeMin).toFixed(2)}` }, { label: 'Base Fare', value: `$${v.baseFare.toFixed(2)}` }, { label: 'Surge ×' + v.surge, value: `$${subtotal.toFixed(2)}` }, { label: 'Tip', value: `$${tip.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }] ,
    extras: [
      { label: 'Service Type Comparison', value: 'UberX: standard 4-seat. UberXL: 6-seat (1.5-2x UberX price). Uber Comfort: newer cars (1.3-1.5x). Uber Black: luxury (2-3x). Lyft: similar tiers. Taxi: metered (often more expensive in traffic)' },
      { label: 'Surge Pricing Tips', value: 'Wait 10-20 minutes for surge to drop from 1.5-2x to 1x. Walk 2-3 blocks away from crowded areas. Book during non-peak hours (avoid 1-3am bar closing, 5-7pm rush hour, major event endings)' },
      { label: 'Pool/Shared Cost Savings', value: 'Uber Pool/Share: 20-40% cheaper than UberX. Lyft Shared: similar savings. Trade-off: 5-15 min extra wait, may walk 2-3 blocks to pickup point. Only saves money if you\'re not in a hurry' },
      { label: 'Airport Fee Add-Ons', value: 'Airport pickups/dropoffs add $3-7 in airport surcharge fees. Some airports have designated rideshare pickup zones 5-10 min walking from terminals. Factor this extra time and cost' },
      { label: 'Cost vs Car Ownership', value: 'Rideshare $1.50-3.00/mi vs owning a car $0.40-0.85/mi (all costs). But: no parking ($100-500/mo in cities), no insurance ($100-200/mo), no car payment ($400-700/mo). For <5 trips/week, rideshare often cheaper in cities' },
      { label: 'Tipping Etiquette', value: 'Ride-hail: tip 15-20% of fare. Delivery: tip $2-5 or 15-20%. Uber/Lyft lets you tip in the app up to 30 days after. Cash tips are always appreciated. Drivers keep 100% of tips since 2020 policy changes' },
      { label: 'Price Estimation Tricks', value: 'Compare Uber and Lyft prices simultaneously — differences of 20-50% are common for the same route. Check both apps before booking. Use Google Maps to compare rates across all services in one view' },
    ]}
  },
  description: 'Estimate rideshare fare including base fare, distance charge, per-minute charge, surge multiplier, and tip. Supports Uber, Lyft, and taxi pricing structures.',
  formula: 'Fare = (BaseFare + PerMile × Distance + PerMin × Time) × Surge. Total = Fare + (Fare × Tip%). TipAmount = Subtotal × Tip% / 100.',
  interpretation: 'A 6-mile, 15-minute UberX ride with typical rates ($2.50 base, $1.50/mi, $0.25/min, 1.0x surge, 15% tip): distance = $9.00, time = $3.75, base = $2.50, subtotal = $15.25, tip = $2.29, total = $17.54. At 2x surge (NYE or bar closing), same trip costs $30.50 + $4.58 tip = $35.08 — double the price. Comparison: a 6-mile taxi ride in NYC costs ~$15-25; a 6-mile subway ride costs $2.90. Rideshare is most cost-effective for groups of 3-4 where you split the fare, dropping cost to $4-6/person — competitive with public transit.'
}

export default calcDef

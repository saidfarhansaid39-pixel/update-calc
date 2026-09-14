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
  defaults: { tlcRouteLength: '20', tlcTollRate: '0.10', tlcFixedTolls: '2', tlcAxles: '2', tlcMonthlyTrips: '20', tlcCarType: 'car' },
  presets: [
    { label: 'Daily Commuter (20 mi)', values: { tlcRouteLength: '20', tlcTollRate: '0.10', tlcFixedTolls: '2', tlcAxles: '2', tlcMonthlyTrips: '22', tlcCarType: 'car' } },
    { label: 'Long Haul Truck (200 mi)', values: { tlcRouteLength: '200', tlcTollRate: '0.15', tlcFixedTolls: '5', tlcAxles: '5', tlcMonthlyTrips: '10', tlcCarType: 'truck' } },
    { label: 'Weekend Motorcycle', values: { tlcRouteLength: '50', tlcTollRate: '0.08', tlcFixedTolls: '1', tlcAxles: '2', tlcMonthlyTrips: '4', tlcCarType: 'moto' } },
    { label: 'Cross-State (100 mi)', values: { tlcRouteLength: '100', tlcTollRate: '0.12', tlcFixedTolls: '3', tlcAxles: '2', tlcMonthlyTrips: '2', tlcCarType: 'car' } },
  ],
  compute: (v) => {
    let axleMultiplier = 1
    if (v.tlcCarType === 'moto') axleMultiplier = 0.5
    else if (v.tlcAxles >= 3) axleMultiplier = 1.5
    const distanceToll = v.tlcRouteLength * v.tlcTollRate * axleMultiplier
    const perTrip = distanceToll + v.tlcFixedTolls
    const monthly = perTrip * v.tlcMonthlyTrips * 2
    const annual = monthly * 12
    return { result: perTrip, label: 'One-Way Toll Cost', unit: '$', steps: [
      { label: 'Formula', value: 'OneWay = (Dist × Rate × Multiplier) + FixedTolls' },
      { label: 'Vehicle Multiplier', value: v.tlcCarType + ' (' + axleMultiplier + '×)' },
      { label: 'Distance Toll', value: v.tlcRouteLength + ' mi × $' + v.tlcTollRate.toFixed(2) + ' × ' + axleMultiplier + ' = $' + distanceToll.toFixed(2) },
      { label: 'Fixed Tolls', value: '$' + v.tlcFixedTolls.toFixed(2) },
      { label: 'One-Way Total', value: '$' + perTrip.toFixed(2) },
      { label: 'Monthly (round trips)', value: perTrip.toFixed(2) + ' × ' + v.tlcMonthlyTrips + ' × 2 = $' + monthly.toFixed(2) },
      { label: 'Annual', value: '$' + annual.toFixed(2) },
    ] ,
    extras: [
      { label: 'Axle Multiplier', value: 'Trucks with 3+ axles pay 1.5-3× base toll rates. Each additional axle adds ~$0.50-2.00 per toll point' },
      { label: 'Motorcycle Savings', value: 'Motorcycles pay 0.5× on most toll roads. Annual savings vs car commuting: $500-1,500 in tolls alone' },
      { label: 'Pass Discounts', value: 'EZ-Pass/SunPass/FasTrak save 10-30% vs plate-by-mail. Some states offer 50% off-peak discounts for pass holders' },
      { label: 'Committer Plans', value: 'State-specific commuter plans: NJ EZ-Pass (15% off), CA FasTrak (volume discounts), FL SunPass (25% off-peak)' },
      { label: 'HOV/Carpool', value: 'Carpool lanes (2+ persons) are often free or 50-75% reduced toll. Check local HOV requirements and hours' },
      { label: 'Toll-Free Routes', value: 'Compare toll vs non-toll routes. A 5 mi longer free route may save $3-8/day in tolls but costs $0.50-1.00 in gas' },
      { label: 'Annual Cost Shock', value: 'A $5/day toll commute = $1,300/year. At $10/day = $2,600/year. That\'s equivalent to a nice vacation' },
      { label: 'Trucking Tax Deduction', value: 'Truck tolls are tax-deductible business expenses for commercial drivers. Keep all toll receipts for Schedule C' },
    ]}
  },
  description: 'Calculate toll costs for any route including distance-based rates, fixed tolls, axle count multipliers, and vehicle class adjustments. See one-way, monthly (round trip), and annual totals.',
  formula: 'One-Way Cost = (Route Length × Toll Rate × Vehicle Multiplier) + Fixed Tolls. Monthly = One-Way × Round Trips × 2. Annual = Monthly × 12. Vehicle multipliers: Car = 1×, Motorcycle = 0.5×, Truck (3+ axles) = 1.5×.',
  interpretation: 'A daily 20-mile car commute with $0.10/mi tolls and $2 in fixed tolls costs $4.00 one-way, $176/month (22 round trips), and $2,112/year. Trucks pay 50% more due to axle multipliers. Motorcycles pay half. Electronic pass discounts can reduce costs by 10-30%. For frequent users, annual passes or commuter plans offer the best savings.'
}

export default calcDef

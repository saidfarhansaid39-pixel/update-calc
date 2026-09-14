import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tripMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vehicleMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'tripMiles', label: 'Trip Distance (miles)', type: 'number', min: 1, step: '10' },
    { name: 'vehicleMpg', label: 'Vehicle MPG', type: 'number', min: 5, step: '1' },
    { name: 'fuelPrice', label: 'Fuel Price per Gallon ($)', type: 'number', min: 1, step: '0.5' },
  ],
  defaults: { tripMiles: '250', vehicleMpg: '25', fuelPrice: '3.5' },
  presets: [
    { label: 'Daily Commute (30 mi round trip)', values: { tripMiles: '30', vehicleMpg: '28', fuelPrice: '3.5' } },
    { label: 'Weekend Road Trip (300 mi)', values: { tripMiles: '300', vehicleMpg: '25', fuelPrice: '3.2' } },
    { label: 'Cross-Country Move (2,500 mi)', values: { tripMiles: '2500', vehicleMpg: '22', fuelPrice: '3.8' } },
    { label: 'SUV/Truck (low MPG)', values: { tripMiles: '100', vehicleMpg: '15', fuelPrice: '3.5' } },
  ],
  compute: (v) => {
    const gallons = v.tripMiles / v.vehicleMpg
    const cost = gallons * v.fuelPrice
    const costPerMile = cost / v.tripMiles
    const costPerDay = cost
    const costPerWeek = costPerDay * 5
    const costPerMonth = costPerDay * 22
    const costPerYear = costPerDay * 260
    const lPer100km = 235.215 / v.vehicleMpg
    const annualFuel = (v.tripMiles / v.vehicleMpg) * 260 * v.fuelPrice
    return { result: cost, label: 'Total Fuel Cost', unit: '$', steps: [{ label: 'Trip Distance', value: `${v.tripMiles} mi (${(v.tripMiles * 1.609).toFixed(0)} km)` }, { label: 'Vehicle Efficiency', value: `${v.vehicleMpg} MPG (${lPer100km.toFixed(1)} L/100km)` }, { label: 'Fuel Price', value: `$${v.fuelPrice.toFixed(2)}/gal` }, { label: 'Gallons Needed', value: `${gallons.toFixed(2)} gal (${(gallons * 3.785).toFixed(1)} L)` }, { label: 'Fuel Cost (this trip)', value: `$${cost.toFixed(2)}` }, { label: 'Cost per Mile', value: `$${costPerMile.toFixed(3)}` }, { label: 'Cost per 10 Miles', value: `$${costPerMile.toFixed(3)}/mi × 10 = $${(costPerMile * 10).toFixed(2)}` }, { label: 'Weekly Commute @ 5×', value: `$${costPerWeek.toFixed(2)}` }] ,
    extras: [
      { label: 'Driving Speed & MPG Impact', value: `Your ${v.vehicleMpg} MPG at 65 mph. MPG changes with speed: 55 mph = +15% = ${(v.vehicleMpg * 1.15).toFixed(1)} MPG (saves $${(gallons - v.tripMiles / (v.vehicleMpg * 1.15)).toFixed(1)} gal). 75 mph = -12% = ${(v.vehicleMpg * 0.88).toFixed(1)} MPG (costs +$${((v.tripMiles / (v.vehicleMpg * 0.88) - gallons) * v.fuelPrice).toFixed(2)}). Every 5 mph over 55 reduces MPG by ~7%. Using cruise control on highway saves 7-14%. For this ${v.tripMiles} mi trip: driving 60 vs 70 mph adds only ${(v.tripMiles / 60 - v.tripMiles / 70).toFixed(0)} min but saves $${((v.tripMiles / (v.vehicleMpg * 0.93) - v.tripMiles / (v.vehicleMpg * 1.07)) * v.fuelPrice).toFixed(2)}.` },
      { label: 'Vehicle Maintenance Effect', value: `Poor maintenance reduces MPG: underinflated tires (-3% = $${((gallons - v.tripMiles / (v.vehicleMpg * 0.97)) * v.fuelPrice).toFixed(2)} this trip), dirty air filter (-10% = $${((gallons - v.tripMiles / (v.vehicleMpg * 0.9)) * v.fuelPrice).toFixed(2)}), old spark plugs (-5% = $${((gallons - v.tripMiles / (v.vehicleMpg * 0.95)) * v.fuelPrice).toFixed(2)}), wrong oil viscosity (-2%), dragging brakes (-15%). Proper maintenance saves $${((v.tripMiles / v.vehicleMpg - v.tripMiles / (v.vehicleMpg * 1.1)) * v.fuelPrice * 260 * 0.1).toFixed(0)}-$${((v.tripMiles / v.vehicleMpg - v.tripMiles / (v.vehicleMpg * 1.2)) * v.fuelPrice * 260 * 0.2).toFixed(0)}/year. Add $100-200/year for maintenance items that improve MPG.` },
      { label: 'Fuel Price Variation by Region', value: `$${v.fuelPrice.toFixed(2)}/gal. Range across US: CA $4.50-5.50 (+30-60% vs average), TX/OK $2.80-3.20 (-10-15%), Midwest $3.00-3.50 (-5-10%), Northeast $3.20-3.80. If this trip crosses states: cost varies by up to 40%. Apps like GasBuddy save $0.10-0.30/gal = $${(gallons * 0.2).toFixed(2)} on this trip. Seasonal: summer blend +$0.10-0.30/gal. For annual $${(v.tripMiles / v.vehicleMpg * 260 * v.fuelPrice).toFixed(0)} fuel spend, choosing cheaper stations saves $${(gallons * 260 * 0.2).toFixed(0)}/year.` },
      { label: 'Total Cost of Driving (vs Fuel Only)', value: `$${costPerMile.toFixed(3)}/mi fuel cost. Full cost per mile: fuel $${costPerMile.toFixed(3)} + maintenance $0.05-0.10 + tires $0.02-0.04 + depreciation $0.10-0.40 + insurance $0.05-0.10 = $${(costPerMile + 0.35).toFixed(2)}-$${(costPerMile + 0.70).toFixed(2)}/mi total. This ${v.tripMiles} mi trip: fuel $${cost.toFixed(2)} but actual cost $${((costPerMile + 0.35) * v.tripMiles).toFixed(0)}-$${((costPerMile + 0.70) * v.tripMiles).toFixed(0)}. IRS standard mileage rate ($${(costPerMile + 0.585).toFixed(3)}/mi for 2024) covers all costs. Your trip = $${(v.tripMiles * 0.655).toFixed(2)} at IRS rate.` },
      { label: 'EV vs Gas Comparison', value: `Your $${v.vehicleMpg} MPG at $${v.fuelPrice.toFixed(2)}/gal = $${costPerMile.toFixed(3)}/mi. EV (3 mi/kWh) at $0.14/kWh = $0.047/mi — save $${((costPerMile - 0.047) * v.tripMiles).toFixed(2)} on this trip. Hybrid (${Math.round(v.vehicleMpg * 1.7)} MPG equiv): $${(v.tripMiles / (v.vehicleMpg * 1.7) * v.fuelPrice).toFixed(2)} — save $${(cost - v.tripMiles / (v.vehicleMpg * 1.7) * v.fuelPrice).toFixed(2)}. PHEV: first ${Math.min(v.tripMiles, 40)} mi on electric = $${(Math.min(v.tripMiles, 40) / 3 * 0.14).toFixed(2)} + rest gas = $${((Math.max(0, v.tripMiles - 40) / v.vehicleMpg) * v.fuelPrice).toFixed(2)} = $${((Math.min(v.tripMiles, 40) / 3 * 0.14) + (Math.max(0, v.tripMiles - 40) / v.vehicleMpg) * v.fuelPrice).toFixed(2)} total.` },
      { label: 'Annual Fuel Budget Projection', value: `If this trip is ${v.tripMiles <= 50 ? 'daily commute: $' + costPerDay.toFixed(2) + '/day = $' + (costPerDay * 260).toFixed(0) + '/year' : v.tripMiles <= 100 ? 'taken weekly: $' + costPerDay.toFixed(2) + '/week = $' + (costPerDay * 52).toFixed(0) + '/year' : 'a one-off trip: $' + cost.toFixed(2)}. Average driver: 13,500 mi/year @ ${v.vehicleMpg} MPG = ${(13500 / v.vehicleMpg).toFixed(0)} gal/year × $${v.fuelPrice.toFixed(2)} = $${(13500 / v.vehicleMpg * v.fuelPrice).toFixed(0)}/year. Reduce 10% by: carpool (saves $${(13500 / v.vehicleMpg * v.fuelPrice * 0.1).toFixed(0)}), combining trips ($${(13500 / v.vehicleMpg * v.fuelPrice * 0.05).toFixed(0)}), remote work 1 day/week ($${(13500 / v.vehicleMpg * v.fuelPrice * 0.2).toFixed(0)}).` },
      { label: 'Route Optimization Savings', value: `$${cost.toFixed(2)} for this route. GPS alternative (10% shorter): $${(cost * 0.9).toFixed(2)}. Avoiding traffic (stop-and-go wastes 20% fuel): $${(cost * 0.8).toFixed(2)}. Combined: $${(cost * 0.72).toFixed(2)} possible. Idling costs: 10 min/day × 260 days = 43 hrs idling × 0.5 gal/hr = 21.5 gal × $${v.fuelPrice.toFixed(2)} = $${(21.5 * v.fuelPrice).toFixed(0)}/year — turn off engine for stops >30 sec. Apps: Waze (5-15% fuel savings), Google Maps eco-routes (save $${(13500 / v.vehicleMpg * v.fuelPrice * 0.05).toFixed(0)}/year).` },
    ]}
  },
  description: 'Calculate fuel cost for any trip using distance, vehicle fuel efficiency, and current fuel price. Includes speed impact analysis, maintenance effects, EV comparisons, and annual fuel budget projections.',
  formula: 'Fuel Cost = (Miles ÷ MPG) × Price per Gallon | Cost per Mile = Fuel Cost ÷ Miles | L/100km = 235.215 ÷ MPG | Weekly = Trip Cost × Days per Week | Annual = Trip Cost × 260 (commute days)',
  interpretation: 'Fuel is typically 30-40% of total driving cost (maintenance, depreciation, insurance make up the rest). At 25 MPG and $3.50/gal, fuel costs $0.14/mile — or $1,890/year for average 13,500 miles. Driving at 55 mph vs 65 mph improves MPG by ~15% and saves $0.02-0.03/mile. Proper tire inflation can improve MPG by up to 3%. Each 5 mph over 55 reduces fuel efficiency by ~7%. Use websites like GasBuddy to find cheapest gas along your route — saving $0.20/gal saves $108/year for average drivers. Combining errands into one trip saves 5-10% on fuel vs multiple short trips from a cold start.'
}

export default calcDef

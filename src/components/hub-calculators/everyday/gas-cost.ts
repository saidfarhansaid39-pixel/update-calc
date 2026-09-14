import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ miles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pricePerGallon: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'miles', label: 'Trip Distance (miles)', type: 'number', min: 1, step: '10' },
    { name: 'mpg', label: 'Vehicle MPG', type: 'number', min: 1, step: '1' },
    { name: 'pricePerGallon', label: 'Fuel Price per Gallon ($)', type: 'number', min: 1, step: '0.3' },
  ],
  defaults: { miles: '150', mpg: '25', pricePerGallon: '3.50' },
  presets: [
    { label: 'Daily Commute (30 mi RT)', values: { miles: '30', mpg: '28', pricePerGallon: '3.50' } },
    { label: 'Weekend Road Trip', values: { miles: '400', mpg: '25', pricePerGallon: '3.30' } },
    { label: 'Cross-Country Move', values: { miles: '2800', mpg: '22', pricePerGallon: '3.60' } },
    { label: 'Hybrid Commute', values: { miles: '150', mpg: '50', pricePerGallon: '3.50' } },
  ],
  compute: (v) => { const mi = parseFloat(v.miles)||0; const m = parseFloat(v.mpg)||0; const ppg = parseFloat(v.pricePerGallon)||0; const gallons = mi / m; const cost = gallons * ppg; const costPerDay = cost; const costPerWeek = cost * 5; const costPerMonth = costPerWeek * 4.33; const costPerMile = cost / mi; return { result: cost, label: 'Fuel Cost', unit: '$', steps: [{ label: 'Gallons Needed', value: `${gallons.toFixed(2)} gal` }, { label: 'Total Fuel Cost', value: `$${cost.toFixed(2)}` }, { label: 'Cost per Mile', value: `$${costPerMile.toFixed(4)}/mi` }, { label: 'Cost per Day (one way)', value: `$${cost.toFixed(2)}` }, { label: 'Weekly Cost (5 days)', value: `$${costPerWeek.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${costPerMonth.toFixed(2)}` }, { label: 'CO₂ Estimate', value: `${(gallons * 19.6).toFixed(1)} lbs CO₂` }, { label: 'Tank % Used', value: `${mi > 0 ? ((gallons / 15) * 100).toFixed(0) : '0'}% of avg tank` }] ,
    extras: [
      { label: 'Fuel Cost per Mile Analysis', value: `$${costPerMile.toFixed(4)}/mi. Over 12,000 mi/yr: $${(costPerMile * 12000).toFixed(0)}. An EV at $0.05/mi would save $${((costPerMile - 0.05) * 12000).toFixed(0)}/yr.` },
      { label: 'Speed vs Efficiency Tradeoff', value: `Every 5 mph over 55 costs ~$0.${Math.round(cost * 0.07).toFixed(0)} more per trip. At ${m} MPG highway, you lose ~${(m * 0.07).toFixed(1)} MPG per 5 mph over. Driving 65 vs 75 saves ~$${(cost * 0.14).toFixed(2)} every ${mi} miles.` },
      { label: 'Gas Price Sensitivity', value: `A $0.50/gal swing changes this trip by $${(gallons * 0.50).toFixed(2)}. Over a year (12,000 mi at ${m} MPG): $${(((12000 / m) * 0.50)).toFixed(0)}. Use GasBuddy to find stations $0.20-0.50 cheaper along your route.` },
      { label: 'Trip Bundling Savings', value: `Combining this ${mi}-mi trip with errands cuts 2-5 cold starts. Cold engines burn 20-50% more fuel for the first 5 min. Bundle 3 trips = save ~$${(cost * 0.15).toFixed(2)} in wasted warm-up fuel.` },
      { label: 'Vehicle MPG Context', value: `${m} MPG: ${m >= 40 ? 'Excellent (hybrid/EV range)' : m >= 30 ? 'Good (compact sedan)' : m >= 20 ? 'Average (SUV/midsize)' : 'Low (truck/van)'}. Proper tire inflation (+3 PSI) can improve MPG by 3%. Remove roof racks when not in use for +5% MPG.` },
      { label: 'Tank Size & Range', value: `Avg tank: 15 gal. At ${m} MPG: ${(15 * m).toFixed(0)} mi range per tank. This trip uses ${((gallons / 15) * 100).toFixed(0)}% of a tank. For a ${mi.toFixed(0)}-mi trip, ${m >= 30 ? 'you can likely make it without refueling' : 'plan a fuel stop'} along the route.` },
      { label: 'Fuel Quality Impact', value: `Using Top Tier gas (detergent additives) keeps injectors clean, maintaining ${m} MPG over time. Non-Top Tier gas can reduce MPG by 2-3% through deposit buildup. Cost difference: ~$0.05-0.10/gal — pays for itself in maintenance savings.` },
      { label: 'Seasonal Fuel Blend Effect', value: `Winter-blend gas has ~2% less energy (lower BTU), reducing MPG by 2-4% Nov-Mar. On this ${mi}-mi trip that's ~$${(cost * 0.03).toFixed(2)} extra. Summer blend returns full efficiency. AC use in summer adds another 5-10% fuel penalty at low speeds.` },
    ]} },
  description: 'Calculate the exact fuel cost for any trip based on distance, vehicle fuel efficiency, and current gas prices. Includes cost-per-mile breakdown, weekly/monthly projections, CO₂ emissions estimate, and tank usage analysis for smarter travel budgeting.',
  formula: 'Fuel Cost = (Miles ÷ MPG) × Price per Gallon | Gallons Needed = Miles ÷ MPG | Cost per Mile = Cost ÷ Miles',
  interpretation: 'Reducing highway speed from 75 to 65 mph cuts fuel consumption ~14%. Proper tire inflation saves 3% on gas. Using cruise control on highways improves MPG by 7-14%. Combining errands into one trip saves 15-20% on fuel vs multiple cold-start trips. At current prices, EVs save $800-1,200/yr in fuel costs compared to a 25 MPG gas car driven 12,000 miles.'
}

export default calcDef

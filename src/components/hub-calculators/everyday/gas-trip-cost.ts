import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tripDistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mpgRating: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasPricePerGal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), returnTrip: z.string().min(1) }),
  fields: [
    { name: 'tripDistance', label: 'One-Way Distance (miles)', type: 'number', min: 1, step: '10' },
    { name: 'mpgRating', label: 'Vehicle MPG', type: 'number', min: 5, step: '1' },
    { name: 'gasPricePerGal', label: 'Gas Price per Gallon ($)', type: 'number', min: 1, step: '0.5' },
    { name: 'returnTrip', label: 'Include Return Trip', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { tripDistance: '200', mpgRating: '28', gasPricePerGal: '3.50', returnTrip: 'yes' },
  presets: [
    { label: 'Beach Weekend', values: { tripDistance: '180', mpgRating: '30', gasPricePerGal: '3.60', returnTrip: 'yes' } },
    { label: 'Family Holiday Drive', values: { tripDistance: '500', mpgRating: '24', gasPricePerGal: '3.40', returnTrip: 'yes' } },
    { label: 'Daily Commute (1 mo)', values: { tripDistance: '30', mpgRating: '28', gasPricePerGal: '3.50', returnTrip: 'yes' } },
    { label: 'Cross-State One-Way', values: { tripDistance: '350', mpgRating: '26', gasPricePerGal: '3.55', returnTrip: 'no' } },
  ],
  compute: (v) => {
    const totalMiles = v.returnTrip === 'yes' ? v.tripDistance * 2 : v.tripDistance
    const gallons = totalMiles / v.mpgRating
    const cost = gallons * v.gasPricePerGal
    const costPerMile = cost / totalMiles
    const costPerPerson = cost / 2.5
    const weeklyCommute = v.returnTrip === 'yes' ? cost * 5 : cost * 10
    const co2Lbs = gallons * 19.6
    const gasStations = Math.ceil(totalMiles / 350)
    return { result: cost, label: 'Gas Cost', unit: '$', steps: [{ label: 'Total Miles', value: `${totalMiles} mi` }, { label: 'Gallons Needed', value: `${gallons.toFixed(2)} gal` }, { label: 'Fuel Cost', value: `$${cost.toFixed(2)}` }, { label: 'Cost per Mile', value: `$${costPerMile.toFixed(4)}` }, { label: 'Cost per Person (×2.5)', value: `$${costPerPerson.toFixed(2)} avg` }, { label: 'Weekly Commute Cost', value: `$${weeklyCommute.toFixed(2)}` }, { label: 'CO₂ Emissions', value: `${co2Lbs.toFixed(0)} lbs` }, { label: 'Fuel Stops Needed', value: `${gasStations} stop(s)` }] ,
    extras: [
      { label: 'Round Trip vs One-Way Impact', value: `Round trip: ${totalMiles} mi = $${cost.toFixed(2)}. One-way would be $${(cost / 2).toFixed(2)} (save $${(cost / 2).toFixed(2)}). If traveling with ${v.returnTrip === 'yes' ? 'a group, splitting costs helps' : 'people who can share the return trip, consider carpooling both ways'} for maximum savings.` },
      { label: 'Gas Price Hunting Strategy', value: `A $0.20/gal difference saves $${(gallons * 0.20).toFixed(2)} on this trip. Use GasBuddy route feature: filters stations along your ${totalMiles}-mi route. ${totalMiles > 200 ? 'On long trips, fill up in cheaper areas (usually suburban/rural stations are $0.10-0.30 cheaper than urban/highway exits).' : 'On short trips, fill up at warehouse clubs (Costco/Sam\'s) for $0.15-0.30/gal savings.'}` },
      { label: 'Vehicle Loading & MPG', value: `Every 100 lbs reduces MPG ~1%. At ${v.mpgRating} MPG, ${v.returnTrip === 'yes' ? 'return trip' : 'trip'} cargo can cost $${(cost * 0.01 * (v.returnTrip === 'yes' ? 2 : 1)).toFixed(2)} per 100 lbs. Pack light: remove roof boxes when possible, don't fill the trunk with non-essentials. Roof boxes reduce highway MPG 5-15% at 65+ mph.` },
      { label: 'Timing Your Fill-Ups', value: `Gas expands in heat — you get slightly less energy per gallon in hot weather (but pump measures volume, not energy). Fill up early morning when ground temp is lowest. ${totalMiles > 300 ? 'Plan to fill at exits with multiple station clusters (competitive pricing).' : 'On shorter trips, fill up before leaving rather than at destination (likely higher prices near tourist areas).'}` },
      { label: 'Fuel Rewards & Credit Cards', value: `Gas rewards cards save $0.05-0.10/gal. Grocery store loyalty programs: $0.10-0.50/gal off for every $100-200 spent. On this trip: $${(gallons * 0.10).toFixed(2)} saved with a basic rewards card. Annual savings at 12,000 mi: $${((12000 / v.mpgRating) * 0.10).toFixed(0)}.` },
      { label: 'Efficient Route Selection', value: `GPS apps with traffic routing save 5-15% on fuel by avoiding stops and slowdowns. ${totalMiles > 100 ? 'On this ${totalMiles}-mi trip, taking the highway (steady 60-65 mph) vs back roads (stops + slower speeds) saves ~$${(cost * 0.10).toFixed(2)}.' : 'On short trips, smooth traffic flow matters more than distance. Avoiding 5 red lights saves ~0.1 gal = $${(0.1 * v.gasPricePerGal).toFixed(2)} per trip.'} Use "eco-route" setting if available.` },
      { label: 'Trip Cost Per Passenger', value: `With 2.5 avg passengers sharing: $${costPerPerson.toFixed(2)}/person. At 4 passengers: $${(cost / 4).toFixed(2)}/person — often cheaper than bus or train. Carpooling this trip with 1 other person saves each person $${(cost / 2).toFixed(2)} vs driving alone.` },
      { label: 'Driving Speed Impact on Cost', value: `At 75 mph vs 65 mph: about 14% more fuel for same distance = $${(cost * 0.14).toFixed(2)} extra on this trip. At ${v.mpgRating} MPG highway rating, driving 75 would drop effective MPG to ~${(v.mpgRating * 0.86).toFixed(0)}, costing $${(gallons / 0.86 - gallons).toFixed(2)} more. Time saved: ~${(totalMiles / 65 - totalMiles / 75).toFixed(1)} hrs.` },
    ]}
  },
  description: 'Plan road trip fuel costs with distance, vehicle MPG, and gas prices. Computes round-trip or one-way costs with cost-per-mile, per-passenger splits, CO₂ emissions, fuel stops, weekly commute projections, and speed-efficiency tradeoffs.',
  formula: 'Total Cost = (Distance × (Round Trip ? 2 : 1) × Gas Price) ÷ MPG | Gallons = Miles ÷ MPG | Cost/Mile = Cost ÷ Miles | CO₂ = Gallons × 19.6 lbs',
  interpretation: 'Gas prices vary by $0.50-1.00/gal between regions — check GasBuddy along your route. Reducing highway speed from 75 to 65 mph cuts fuel use ~14%. Carpooling with 2+ people halves per-person costs. Fuel rewards credit cards save $0.05-0.10/gal. Avoid roof racks for +5% MPG on highways. Every 100 lbs reduces MPG ~1%.'
}

export default calcDef

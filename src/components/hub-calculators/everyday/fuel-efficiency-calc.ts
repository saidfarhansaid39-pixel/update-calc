import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ milesTraveled: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gallonsConsumed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'milesTraveled', label: 'Miles Traveled', type: 'number', min: 1, step: '10' },
    { name: 'gallonsConsumed', label: 'Gallons Used', type: 'number', min: 0.1, step: '0.5' },
  ],
  defaults: { milesTraveled: '300', gallonsConsumed: '12' },
  presets: [
    { label: 'Highway Trip (sedan)', values: { milesTraveled: '350', gallonsConsumed: '10' } },
    { label: 'City Driving (SUV)', values: { milesTraveled: '200', gallonsConsumed: '14' } },
    { label: 'Mixed City/Hwy (compact)', values: { milesTraveled: '300', gallonsConsumed: '9' } },
    { label: 'Truck Towing Load', values: { milesTraveled: '180', gallonsConsumed: '20' } },
  ],
  compute: (v) => {
    const mpg = v.milesTraveled / v.gallonsConsumed
    const lPer100km = 235.215 / mpg
    const kmPerLiter = mpg * 0.425144
    const galPer100Mi = 100 / mpg
    const annualFuel13k = (13500 / mpg) * 3.5
    const annualFuel15k = (15000 / mpg) * 3.5
    const co2PerYear = (13500 / mpg) * 8.887
    const tankRange = mpg * 15
    return { result: mpg, label: 'Fuel Efficiency', unit: 'MPG', steps: [{ label: 'Miles Driven', value: `${v.milesTraveled} mi (${(v.milesTraveled * 1.609).toFixed(0)} km)` }, { label: 'Gallons Used', value: `${v.gallonsConsumed} gal (${(v.gallonsConsumed * 3.785).toFixed(1)} L)` }, { label: 'Miles per Gallon', value: `${mpg.toFixed(1)} MPG` }, { label: 'Liters per 100km', value: `${lPer100km.toFixed(1)} L/100km` }, { label: 'Kilometers per Liter', value: `${kmPerLiter.toFixed(1)} km/L` }, { label: 'Gallons per 100 Miles', value: `${galPer100Mi.toFixed(2)} gal/100mi` }, { label: 'Est. Tank Range (15 gal)', value: `${tankRange.toFixed(0)} mi` }, { label: 'Annual CO₂ (13,500 mi)', value: `${co2PerYear.toFixed(0)} kg` }] ,
    extras: [
      { label: 'Fuel Grade & Efficiency Impact', value: `${mpg.toFixed(1)} MPG achieved. Using premium in an engine designed for regular: no MPG benefit ($$${(v.gallonsConsumed * 0.5).toFixed(2)} extra this tank). Using regular in a premium-required engine: -3-5% MPG = ${(mpg * 0.96).toFixed(1)} MPG (costs $${((v.milesTraveled / (mpg * 0.96) - v.gallonsConsumed) * (v.gallonsConsumed > 0 ? (3.5) : 3.5)).toFixed(2)} more). Top Tier detergent gas: keeps injectors clean, maintaining +2-3% MPG over 10k mi. Ethanol-free gas: +3-5% MPG but costs $0.50-1.00 more/gal — breakeven at ${mpg > 25 ? 'not worth it' : 'possibly worth it for small engines'}. Use the octane your owner's manual recommends.` },
      { label: 'Driving Conditions Context', value: `Your ${mpg.toFixed(1)} MPG over ${v.milesTraveled} mi. EPA city: typically 20% lower than highway. If this trip was all highway: ${mpg.toFixed(1)} is ${mpg >= 35 ? 'excellent (hybrid/compact)' : mpg >= 28 ? 'good (efficient sedan)' : mpg >= 22 ? 'average (mid-size)' : 'low (large SUV/truck'}). If city driving: ${mpg.toFixed(1)} is ${mpg >= 25 ? 'great' : mpg >= 18 ? 'average' : 'low'}. Cold weather (-10°F vs 70°F): MPG drops 15-25% on short trips. A/C use: -5-10% in city, -1-3% highway. Windows down: -2-5% at highway speeds. Your ${mpg.toFixed(1)} MPG in ${v.milesTraveled} mi ${v.milesTraveled > 300 ? '(likely highway mix)' : '(likely mixed/city)'} is ${mpg >= 25 ? 'above average' : 'within typical range'}.` },
      { label: 'Fleet Comparison & Benchmark', value: `Your ${mpg.toFixed(1)} MPG vs: 2024 Toyota Camry (32 city/41 hwy), Honda Civic (31/40), Ford F-150 (20/24), Tesla Model 3 (132 MPGe), Toyota RAV4 Hybrid (41/38). ${mpg >= 35 ? 'You\'re in compact/hybrid territory ✓' : mpg >= 28 ? 'You\'re in efficient sedan range' : mpg >= 22 ? 'Average for US fleet (25.4 MPG avg)' : 'Below US average — consider: check tire pressure, air filter, driving habits'}. Best ${v.milesTraveled <= 100 ? 'city' : 'highway'} cars: Hyundai Elantra (33/42), Honda Accord (29/37), Mazda 3 (28/37). An EV at 3 mi/kWh = 100 MPGe equivalent — 4× your efficiency.` },
      { label: 'Maintenance Impact on MPG', value: `At ${mpg.toFixed(1)} MPG: tire pressure -5 PSI = -3% = ${(mpg * 0.97).toFixed(1)} MPG (lose $${((v.milesTraveled / (mpg * 0.97) - v.gallonsConsumed) * 3.5).toFixed(2)} on this tank). Dirty air filter: -10% = ${(mpg * 0.9).toFixed(1)} MPG. Worn spark plugs: -5% = ${(mpg * 0.95).toFixed(1)} MPG. Winter blend gas: -5-10% = ${(mpg * 0.93).toFixed(1)} MPG. Synthetic oil vs conventional: +1-3% = ${(mpg * 1.02).toFixed(1)} MPG. Over 13,500 mi/year, restoring even 5% efficiency saves $${(13500 / mpg * 3.5 * 0.05).toFixed(0)}-$${(13500 / (mpg * 0.95) * 3.5 - 13500 / mpg * 3.5).toFixed(0)}/year.` },
      { label: 'Efficiency Tiers & Improvement Cost', value: `$${(13500 / mpg * 3.5).toFixed(0)}/year at 13,500 mi. Improve from ${mpg.toFixed(0)} to ${(mpg + 5).toFixed(0)} MPG (+${(5 / mpg * 100).toFixed(0)}%): saves $${(13500 / mpg * 3.5 - 13500 / (mpg + 5) * 3.5).toFixed(0)}/year. From ${mpg.toFixed(0)} to ${(mpg + 10).toFixed(0)} MPG: saves $${(13500 / mpg * 3.5 - 13500 / (mpg + 10) * 3.5).toFixed(0)}/year. Methods: gentle acceleration (+5-15%), coast to stops (+5-10%), remove roof rack (-5-15% at highway), reduce cargo weight (-1-2% per 100 lb), combine short trips (+10-20%). Cost: free (driving habits) to $$$ (new vehicle).` },
      { label: 'Cost Comparison: Gas vs Electric', value: `$${(13500 / mpg * 3.5).toFixed(0)}/year gas. EV equivalent: 13,500 mi ÷ 3 mi/kWh × $0.14/kWh = $${(13500 / 3 * 0.14).toFixed(0)}/year — save $${(13500 / mpg * 3.5 - 13500 / 3 * 0.14).toFixed(0)}/year. Hybrid: ${(mpg * 1.5).toFixed(0)} MPG estimated = $${(13500 / (mpg * 1.5) * 3.5).toFixed(0)}/year — save $${(13500 / mpg * 3.5 - 13500 / (mpg * 1.5) * 3.5).toFixed(0)}/year. Over 5 years: gas = $${(13500 / mpg * 3.5 * 5).toFixed(0)}, hybrid = $${(13500 / (mpg * 1.5) * 3.5 * 5).toFixed(0)}, EV = $${(13500 / 3 * 0.14 * 5).toFixed(0)} (fuel only).` },
      { label: 'Eco-Driving Score & Target', value: `Your ${mpg.toFixed(1)} MPG = ${mpg >= 35 ? 'A (excellent)' : mpg >= 28 ? 'B (good)' : mpg >= 22 ? 'C (average)' : mpg >= 16 ? 'D (below average)' : 'F (poor)'}. Eco-driving techniques: accelerate gently (0-20 mph in 15 sec = +15% MPG), maintain steady speed (cruise control = +7%), anticipate stops (coast = +10%), avoid short trips (<3 mi = +20% when combined). Target: improve by ${mpg < 25 ? '5 MPG' : '2-3 MPG'} = save $${(13500 / mpg * 3.5 - 13500 / (mpg + (mpg < 25 ? 5 : 3)) * 3.5).toFixed(0)}/year. Most drivers can improve 10-30% with conscious driving habits.` },
      { label: 'Trip Logging Best Practices', value: `For best accuracy: fill tank fully (click off 2×), reset trip meter, drive normally, refill at same pump. Your ${v.milesTraveled} mi on ${v.gallonsConsumed} gal = ${mpg.toFixed(1)} MPG. Log 3-5 consecutive tanks for reliable average. Seasonal variation: summer MPG +5-10% vs winter (winter blend + cold starts + tire pressure). Altar: +3% per 1,000 ft elevation (thinner air = less drag). Best to average across seasons for true annual MPG. Use Fuelly or similar apps to track long-term trends.` },
    ]}
  },
  description: 'Calculate your vehicle fuel efficiency in MPG and L/100km based on miles driven and gallons of fuel consumed. Includes detailed driving condition analysis, fleet benchmarking, and eco-driving improvement targets.',
  formula: 'MPG = Miles ÷ Gallons | L/100km = 235.215 ÷ MPG | km/L = MPG × 0.425 | Gal/100mi = 100 ÷ MPG | Annual CO₂ = (13,500 ÷ MPG) × 8.887 kg | Tank Range = MPG × 15 gal',
  interpretation: 'Fill up fully and reset trip meter for accurate readings. Average over 3-5 consecutive tanks for reliable data. US fleet average is ~25 MPG. Winter blend gas reduces MPG by 5-10%. Proper tire inflation improves MPG by up to 3%. Aggressive driving (rapid acceleration, hard braking) can lower MPG by 15-30% at highway speeds and 10-40% in stop-and-go traffic. Each 5 mph over 55 reduces efficiency by ~7%. The single biggest factor is your right foot — gentle acceleration and anticipating stops can improve MPG by 20-30% with no cost at all.'
}

export default calcDef

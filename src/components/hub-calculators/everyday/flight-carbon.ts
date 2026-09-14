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
  defaults: { flightDistance: '3500', distanceUnit: 'mi', flightClass: 'economy', numPassengers: '1' },
  presets: [
    { label: 'NYC↔London Round Trip Economy', values: { flightDistance: '3500', distanceUnit: 'mi', flightClass: 'economy', numPassengers: '1' } },
    { label: 'LA↔NYC Round Trip Economy', values: { flightDistance: '2500', distanceUnit: 'mi', flightClass: 'economy', numPassengers: '1' } },
    { label: 'SF↔Tokyo Business Class', values: { flightDistance: '5100', distanceUnit: 'mi', flightClass: 'business', numPassengers: '1' } },
    { label: 'Family of 4: Chicago↔Orlando', values: { flightDistance: '1000', distanceUnit: 'mi', flightClass: 'economy', numPassengers: '4' } },
  ],
  compute: (v) => {
    const distKm = v.distanceUnit === 'mi' ? v.flightDistance * 1.609 : v.flightDistance
    const classMultipliers: Record<string, number> = { economy: 1, premium: 1.5, business: 3, first: 4 }
    const multiplier = classMultipliers[v.flightClass as keyof typeof classMultipliers] || 1
    const co2PerKm = 0.115 * multiplier
    const totalCo2 = distKm * co2PerKm * v.numPassengers
    const perPassenger = distKm * co2PerKm
    const avgCarKm = totalCo2 / 0.24
    const offsetTrees = Math.ceil(totalCo2 / 1000 * 45)
    const offsetCost = totalCo2 / 1000 * 20
    return { result: totalCo2, label: 'Total CO₂ Emissions', unit: 'kg', steps: [{ label: 'Flight Distance', value: `${distKm.toFixed(0)} km (${v.flightDistance} mi)` }, { label: 'Class Factor', value: `${multiplier}× ${v.flightClass} class` }, { label: 'CO₂ per Passenger', value: `${perPassenger.toFixed(0)} kg` }, { label: 'Number of Passengers', value: `${v.numPassengers}` }, { label: 'Total CO₂ Emissions', value: `${totalCo2.toFixed(0)} kg (${(totalCo2 / 1000).toFixed(2)} tonnes)` }, { label: 'Equivalent Car Travel', value: `${avgCarKm.toFixed(0)} km (${(avgCarKm / 1.609).toFixed(0)} mi)` }, { label: 'Trees to Offset Annually', value: `${offsetTrees} trees` }, { label: 'Est. Offset Cost @ $20/tonne', value: `$${offsetCost.toFixed(2)}` }] ,
    extras: [
      { label: 'Class Comparison', value: `${v.flightClass} = ${multiplier}× economy. If you upgraded from ${v.flightClass} to ${v.flightClass === 'first' ? '— already highest' : v.flightClass === 'business' ? 'first (4×)' : v.flightClass === 'premium' ? 'business (3×)' : 'premium (1.5×)'}, your CO₂ would ${multiplier < 4 ? 'increase' : 'stay same'} to ${(distKm * 0.115 * (multiplier < 4 ? classMultipliers[Object.keys(classMultipliers)[Object.keys(classMultipliers).indexOf(v.flightClass) + 1]] : 4) * v.numPassengers).toFixed(0)} kg (${multiplier < 4 ? '+' + Math.round((distKm * 0.115 * (classMultipliers[Object.keys(classMultipliers)[Object.keys(classMultipliers).indexOf(v.flightClass) + 1]] - multiplier) / totalCo2 * 100)) + '%' : 'same'}). A family of ${v.numPassengers} flying economy produces same CO₂ as ${Math.ceil(v.numPassengers / multiplier)} person${v.numPassengers / multiplier > 1 ? 's' : ''} in premium.` },
      { label: 'Radiative Forcing Factor', value: `Add +90% for non-CO₂ effects (contrails, NOx, water vapor) at altitude. Effective CO₂e: ${(totalCo2 * 1.9).toFixed(0)} kg. This means your ${(totalCo2 / 1000).toFixed(2)} tonnes actual = ${(totalCo2 * 1.9 / 1000).toFixed(2)} tonnes CO₂e. Aviation accounts for 2.5% of CO₂ but ~4% of total warming impact due to these multiplier effects. Night flights and winter flights create more persistent contrails.` },
      { label: 'Aircraft Efficiency Comparison', value: `Average: 0.115 kg CO₂/km. Modern narrowbody (A320neo, 737 MAX): 0.065-0.085 kg/km — saves 25-40%. Widebody (787, A350): 0.080-0.095 kg/km. Old aircraft (747, MD-80): 0.12-0.18 kg/km. Airlines with newer fleets (e.g., NEO/MAX): up to 20% lower emissions per seat-mile. If this airline operates a fleet averaging 0.08 kg/km, your actual CO₂ is ${(distKm * 0.08 * multiplier * v.numPassengers).toFixed(0)} kg — saving ${(totalCo2 - distKm * 0.08 * multiplier * v.numPassengers).toFixed(0)} kg.` },
      { label: 'Route Optimization', value: `Direct flight (${distKm.toFixed(0)} km): ${totalCo2.toFixed(0)} kg. With a 200 km detour for a connection: +${(200 * co2PerKm * v.numPassengers).toFixed(0)} kg (+${(200 / distKm * 100).toFixed(0)}%). Takeoff and landing add ~300 kg per segment — a connection adds ${(300 * v.numPassengers).toFixed(0)} kg from two TOL cycles vs ${(150 * v.numPassengers).toFixed(0)} kg for direct. Always choose non-stop when available for ${Math.round(200 / distKm * 100 + 150 / (distKm * co2PerKm) * 100)}% total savings.` },
      { label: 'Carbon Budget Analysis', value: `${v.numPassengers === 1 ? 'Your' : v.numPassengers + ' passengers\' total'} ${(totalCo2 / 1000).toFixed(2)} tonnes = ${(totalCo2 / 1000 / 4.8 * 100).toFixed(1)}% of annual global per-person budget (4.8t) or ${(totalCo2 / 1000 / 16 * 100).toFixed(1)}% of US average (16t). ${totalCo2 / 1000 > 4.8 ? '⚠ Exceeds the annual carbon budget of an average global citizen.' : totalCo2 / 1000 > 2.3 ? 'Exceeds the 2030 target of 2.3t/year/person.' : 'Within reasonable annual travel budget.'} A ${v.flightClass} class flight multiplies this impact ×${multiplier}.` },
      { label: 'Future Aviation Fuel Impact', value: `SAF (Sustainable Aviation Fuel) reduces lifecycle CO₂ by 50-80% but costs 2-5× more. If this airline uses 10% SAF blend: ${(totalCo2 * 0.9).toFixed(0)} kg. EU mandates 2% SAF by 2025, 70% by 2050. Electric aircraft: viable for <500 km by 2030 (1-2% of flights). For this ${distKm.toFixed(0)} km route: today = ${totalCo2.toFixed(0)} kg, with 50% SAF in 2035 = ${(totalCo2 * 0.5).toFixed(0)} kg.` },
      { label: 'Comparable Daily Activities', value: `${totalCo2.toFixed(0)} kg CO₂ = driving ${avgCarKm.toFixed(0)} km or ${(totalCo2 / 0.001 * 0.01).toFixed(0)} smartphone charges. Average US home electricity/month: 886 kWh = 400 kg CO₂. Your flight = ${(totalCo2 / 400).toFixed(1)} months of household electricity. ${(totalCo2 / 4.5).toFixed(0)} cheeseburgers (beef). Eating plant-based for ${(totalCo2 / 2.5).toFixed(0)} days offsets the same CO₂.` },
    ]}
  },
  description: 'Calculate the carbon footprint of air travel based on distance, travel class, and number of passengers. Includes aircraft efficiency comparison, radiative forcing factor, and SAF fuel impact analysis.',
  formula: 'CO₂ (kg) = Distance(km) × 0.115 × Class Multiplier × Passengers | Class Factors: Economy 1×, Premium 1.5×, Business 3×, First 4× | CO₂e = CO₂ × 1.9 (radiative forcing)',
  interpretation: 'A round-trip NYC-London economy flight emits ~1.6 tonnes CO₂ per passenger. Business class emits 3× more per seat due to larger seat footprint and fewer passengers per flight. Accounting for radiative forcing (contrails, NOx), the true climate impact is ~1.9× higher. Aviation contributes 2.5% of global CO₂ but ~4% of warming. To reduce: choose economy class, fly direct, select airlines with modern fuel-efficient fleets, and consider train alternatives for short routes (<500 km). One less long-haul flight per year reduces your carbon footprint more than a year of car-free commuting.'
}

export default calcDef

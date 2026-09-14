import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ electricityKwh: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), carMiles: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), flights: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dietType: z.string().min(1) }),
  fields: [
    { name: 'electricityKwh', label: 'Monthly Electricity (kWh)', type: 'number', min: 0, step: '100' },
    { name: 'carMiles', label: 'Monthly Car Miles', type: 'number', min: 0, step: '100' },
    { name: 'flights', label: 'Flights Taken (short haul)', type: 'number', min: 0, step: '1' },
    { name: 'dietType', label: 'Diet Type', type: 'select', options: [{ label: 'Meat-heavy', value: 'meat' }, { label: 'Average', value: 'average' }, { label: 'Vegetarian', value: 'vegetarian' }, { label: 'Vegan', value: 'vegan' }] },
  ],
  defaults: { electricityKwh: '900', carMiles: '1000', flights: '1', dietType: 'average' },
  presets: [
    { label: 'Average US Household', values: { electricityKwh: '1100', carMiles: '1200', flights: '2', dietType: 'average' } },
    { label: 'Low-Carbon Commuter', values: { electricityKwh: '500', carMiles: '300', flights: '1', dietType: 'vegetarian' } },
    { label: 'Frequent Flyer', values: { electricityKwh: '800', carMiles: '800', flights: '6', dietType: 'average' } },
    { label: 'Eco-Conscious Minimalist', values: { electricityKwh: '300', carMiles: '200', flights: '0', dietType: 'vegan' } },
  ],
  compute: (v) => {
    const dietFactors: Record<string, number> = { meat: 1600, average: 1200, vegetarian: 800, vegan: 500 }
    const electricCO2 = v.electricityKwh * 0.92
    const carCO2 = v.carMiles * 0.41
    const flightCO2 = v.flights * 200
    const dietCO2 = (dietFactors[v.dietType] || 1200) / 12
    const totalMonthly = electricCO2 + carCO2 + flightCO2 + dietCO2
    const totalAnnual = totalMonthly * 12
    const electricPct = totalMonthly > 0 ? (electricCO2 / totalMonthly) * 100 : 0
    const carPct = totalMonthly > 0 ? (carCO2 / totalMonthly) * 100 : 0
    const flightPct = totalMonthly > 0 ? (flightCO2 / totalMonthly) * 100 : 0
    const dietPct = totalMonthly > 0 ? (dietCO2 / totalMonthly) * 100 : 0
    const usAvgRatio = totalAnnual / 40000
    const globalAvgRatio = totalAnnual / 10000
    return {
      result: totalAnnual, label: 'Annual CO2 Footprint', unit: 'lbs',
      steps: [
        { label: 'Electricity', value: `${electricCO2.toFixed(0)} lbs/mo (${v.electricityKwh} kWh × 0.92)` },
        { label: 'Car Travel', value: `${carCO2.toFixed(0)} lbs/mo (${v.carMiles} mi × 0.41)` },
        { label: 'Flights', value: `${flightCO2.toFixed(0)} lbs/mo (${v.flights} flights × 200)` },
        { label: 'Diet', value: `${dietCO2.toFixed(0)} lbs/mo (${v.dietType} diet: ${dietFactors[v.dietType]} lbs/yr ÷ 12)` },
        { label: 'Monthly Total', value: `${totalMonthly.toFixed(0)} lbs CO2` },
        { label: 'Annual Total', value: `${totalAnnual.toFixed(0)} lbs CO2` },
        { label: 'Breakdown', value: `Electric ${electricPct.toFixed(0)}% | Car ${carPct.toFixed(0)}% | Flights ${flightPct.toFixed(0)}% | Diet ${dietPct.toFixed(0)}%` },
        { label: 'vs. Benchmarks', value: `${usAvgRatio.toFixed(1)}× US avg (40K lbs) | ${globalAvgRatio.toFixed(1)}× global avg (10K lbs)` },
      ],
      extras: [
        { label: 'Your Largest Lever', value: `Your top source: ${[['Electricity', electricPct], ['Car', carPct], ['Flights', flightPct], ['Diet', dietPct]].sort((a: (string|number)[], b: (string|number)[]) => (b[1] as number) - (a[1] as number))[0][0]} at ${Math.max(electricPct, carPct, flightPct, dietPct).toFixed(0)}% of footprint. Focus reduction efforts here first.` },
        { label: 'Flight Impact Scale', value: 'One round-trip short-haul flight (NYC-DC) = ~400 lbs CO2. One long-haul flight (NYC-London) = ~2,000 lbs CO2. A single round trip to Europe can double your annual carbon footprint.' },
        { label: 'Electricity Reduction', value: 'Switching to renewable energy (solar, wind) reduces electricity emissions by 80-100%. Energy Star appliances save 10-50% per device. LED bulbs use 75% less energy than incandescent.' },
        { label: 'Diet Change Impact', value: 'Meat-heavy diet: 1,600 lbs/yr. Vegan: 500 lbs/yr. Going vegetarian saves ~800 lbs CO2/yr — equivalent to not driving 2,000 miles. Beef has 5× the carbon footprint of chicken per pound.' },
        { label: 'Transportation Alternatives', value: 'Public transit: 0.2 lbs CO2/mi (vs 0.41 for car). E-bike: 0.02 lbs/mi. Electric car: 0.15 lbs/mi (grid-dependent). Telecommuting 1 day/week saves ~900 lbs CO2/yr.' },
        { label: 'Carbon Offsetting Costs', value: 'Offsetting 40,000 lbs CO2 costs $100-400/yr via verified programs (Gold Standard, Verra). Tree planting: ~50 lbs CO2/tree/year. You\'d need ${(totalAnnual / 50).toFixed(0)} trees/year to offset your footprint.' },
        { label: 'Paris Agreement Target', value: 'To limit warming to 1.5°C, global average needs to fall from 10,000 to ~2,500 lbs CO2/person/year by 2030. Your footprint of ${totalAnnual.toFixed(0)} lbs is ${(totalAnnual / 2500).toFixed(1)}× the 2030 target.' },
        { label: 'Home Energy Audit', value: 'A professional home energy audit ($100-400) identifies drafts, insulation gaps, and inefficient appliances. Average savings: 15-30% on energy bills and corresponding carbon reduction.' },
      ]
    }
  },
  description: 'Estimate your annual carbon footprint from electricity, car travel, flights, and diet. Break down your CO2 by source, compare to US and global averages, and identify the biggest levers for reduction.',
  formula: 'Annual Footprint = (Electric(kWh×0.92) + Car(miles×0.41) + Flights(count×200) + Diet/12) × 12 | Diet: meat=1,600, average=1,200, vegetarian=800, vegan=500 lbs/yr',
  interpretation: 'US average: ~40,000 lbs CO2/yr. Global average: ~10,000 lbs/yr. To reach Paris Agreement targets, aim for <5,000 lbs/yr by 2030. Biggest individual levers: eliminate flying, switch to plant-based diet, use renewable energy, and drive an EV or use public transit. Every 1,000 lbs reduction matters — start with the largest source.'
}

export default calcDef

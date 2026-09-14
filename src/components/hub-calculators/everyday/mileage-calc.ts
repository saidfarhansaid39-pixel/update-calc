import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelUsed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelUnit: z.string().min(1), fuelPrice: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'distance', label: 'Distance Traveled', type: 'number', min: 1, step: '10' },
    { name: 'fuelUsed', label: 'Fuel Used', type: 'number', min: 0.1, step: '1' },
    { name: 'fuelUnit', label: 'Unit System', type: 'select', options: [{ label: 'Miles / US Gallons', value: 'us' }, { label: 'Kilometers / Liters', value: 'metric' }] },
    { name: 'fuelPrice', label: 'Price per Gallon/Liter ($)', type: 'number', min: 0.01, step: '0.1' },
  ],
  defaults: { distance: '300', fuelUsed: '12', fuelUnit: 'us', fuelPrice: '3.50' },
  presets: [
    { label: 'Typical Commute Week', values: { distance: '250', fuelUsed: '10', fuelUnit: 'us', fuelPrice: '3.50' } },
    { label: 'Road Trip', values: { distance: '800', fuelUsed: '32', fuelUnit: 'us', fuelPrice: '3.60' } },
    { label: 'Fuel-Efficient Car', values: { distance: '400', fuelUsed: '10', fuelUnit: 'us', fuelPrice: '3.50' } },
    { label: 'Metric: European Drive', values: { distance: '500', fuelUsed: '40', fuelUnit: 'metric', fuelPrice: '1.80' } },
  ],
  compute: (v) => {
    let mpg: number, costPerMile: number, tripCost: number, l100km: number
    if (v.fuelUnit === 'us') {
      mpg = v.distance / v.fuelUsed
      costPerMile = v.fuelPrice / mpg
      tripCost = v.fuelUsed * v.fuelPrice
      l100km = 235.215 / mpg
    } else {
      l100km = v.fuelUsed / v.distance * 100
      mpg = 235.215 / l100km
      costPerMile = v.fuelPrice / (v.distance / v.fuelUsed)
      tripCost = v.fuelUsed * v.fuelPrice
    }
    const annualMiles = 12000
    const annualFuelCost = v.fuelUnit === 'us' ? (annualMiles / mpg) * v.fuelPrice : (annualMiles * 1.60934 / (v.distance / v.fuelUsed)) * v.fuelPrice
    return { result: mpg, label: 'Fuel Efficiency', unit: 'MPG', steps: [
      { label: 'Distance', value: `${v.distance} ${v.fuelUnit === 'us' ? 'miles' : 'km'}` },
      { label: 'Fuel Used', value: `${v.fuelUsed} ${v.fuelUnit === 'us' ? 'gallons' : 'liters'}` },
      { label: 'Fuel Economy', value: v.fuelUnit === 'us' ? `${v.distance} / ${v.fuelUsed} = ${mpg.toFixed(1)} MPG` : `${v.fuelUsed}L / ${v.distance}km × 100 = ${l100km.toFixed(1)} L/100km` },
      { label: 'Metric Equivalent', value: v.fuelUnit === 'us' ? `${l100km.toFixed(1)} L/100km` : `${mpg.toFixed(1)} MPG equivalent` },
      { label: 'Cost per Mile/km', value: `$${costPerMile.toFixed(3)}` },
      { label: 'Trip Fuel Cost', value: `$${tripCost.toFixed(2)}` },
      { label: 'Est. Annual Fuel Cost', value: `$${annualFuelCost.toFixed(0)}/yr (12,000 mi)` },
    ] ,
    extras: [
      { label: 'US Average MPG', value: 'The average US vehicle gets ~25 MPG. New cars average 30+ MPG. EVs get 100+ MPGe.' },
      { label: 'L/100km Conversion', value: 'To convert MPG to L/100km: 235.215 ÷ MPG. Lower L/100km = better efficiency. 25 MPG = 9.4 L/100km.' },
      { label: 'Fuel Cost Savings', value: `At $${v.fuelPrice.toFixed(2)}/${v.fuelUnit === 'us' ? 'gal' : 'L'}, improving from 25→30 MPG saves ~$${(annualMiles / 25 * v.fuelPrice - annualMiles / 30 * v.fuelPrice).toFixed(0)}/year.` },
      { label: 'Driving Habits', value: 'Aggressive driving (rapid acceleration/braking) lowers MPG by 15-30% at highway speeds and 10-40% in stop-and-go traffic.' },
      { label: 'Tire Pressure', value: 'Under-inflated tires (5-10 PSI low) reduce MPG by 3-5%. Properly inflated tires + alignment = maximum efficiency.' },
      { label: 'Idling Costs', value: 'Idling burns 0.2-0.5 gal/hr. A 10-minute daily warm-up costs ~$50-100/year in wasted fuel.' },
    ]}
  },
  description: 'Calculate your vehicle\'s fuel efficiency in MPG (or L/100km) and trip costs based on distance traveled and fuel consumed. Includes annual fuel cost projections and driving habit analysis.',
  formula: 'MPG = Miles / Gallons | L/100km = Liters / km × 100 | CostPerMile = PricePerGallon / MPG | Conversion: L/100km = 235.215 / MPG',
  interpretation: 'US average fuel economy is ~25 MPG (9.4 L/100km). Higher MPG means better efficiency and lower fuel costs. A car getting 30 MPG saves ~$500/year in fuel vs one getting 20 MPG at 12,000 miles/year. For metric users: L/100km is the standard outside the US — lower numbers are better. Your driving habits, tire pressure, and maintenance significantly affect real-world efficiency vs EPA ratings.'
}

export default calcDef

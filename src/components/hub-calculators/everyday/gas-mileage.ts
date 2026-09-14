import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ milesDriven: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gallonsUsed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'milesDriven', label: 'Miles Driven', type: 'number', min: 1, step: '10' },
    { name: 'gallonsUsed', label: 'Gallons Used', type: 'number', min: 0.1, step: '1' },
  ],
  defaults: { milesDriven: '350', gallonsUsed: '11.5' },
  presets: [
    { label: 'Compact Car Tank', values: { milesDriven: '380', gallonsUsed: '11' } },
    { label: 'Midsize SUV Tank', values: { milesDriven: '310', gallonsUsed: '15' } },
    { label: 'Hybrid Tank', values: { milesDriven: '520', gallonsUsed: '9.5' } },
    { label: 'Full-Size Truck Tank', values: { milesDriven: '270', gallonsUsed: '18' } },
  ],
  compute: (v) => { const md = parseFloat(v.milesDriven)||0; const gu = parseFloat(v.gallonsUsed)||0; const mpg = md / gu; const lPer100km = 235.215 / mpg; const kmL = mpg * 0.4251; const annualFuel = 12000 / mpg; const annualCost = annualFuel * 3.50; const tankRange = mpg * 15; const co2Tank = gu * 19.6; return { result: mpg, label: 'Fuel Economy', unit: 'MPG', steps: [{ label: 'Miles per Gallon', value: `${mpg.toFixed(1)} mpg` }, { label: 'Liters per 100 km', value: `${lPer100km.toFixed(1)} L/100km` }, { label: 'Kilometers per Liter', value: `${kmL.toFixed(1)} km/L` }, { label: 'Annual Fuel (12k mi)', value: `${annualFuel.toFixed(0)} gal` }, { label: 'Annual Cost @ $3.50', value: `$${annualCost.toFixed(0)}` }, { label: 'Tank Range (15 gal)', value: `${tankRange.toFixed(0)} mi` }, { label: 'CO₂ This Tank', value: `${co2Tank.toFixed(0)} lbs` }, { label: 'Efficiency Class', value: `${mpg >= 40 ? 'Excellent' : mpg >= 30 ? 'Good' : mpg >= 20 ? 'Average' : 'Below Avg'}` }] ,
    extras: [
      { label: 'Tank-to-Tank Variability', value: `This tank: ${md} mi on ${gu} gal = ${mpg.toFixed(1)} MPG. Pump shutoff timing alone causes 0.3-0.5 gal variance, changing MPG by up to ${(0.5 / gu * mpg).toFixed(1)}. Track 3+ tanks (use a notes app) and divide total miles by total gallons for your true average.` },
      { label: 'Driving Condition Impact', value: `${md >= 350 ? 'Highway-dominant tank: MPG benefit from steady speeds + 7-14% cruise control savings.' : 'City-dominant tank: stop-and-go reduces MPG 20-40%.'} At ${mpg.toFixed(1)} MPG, your ${md >= 350 ? 'highway' : 'city'} pattern is ${mpg >= 30 ? 'efficient for this driving type' : 'typical for this driving type'}. Idling burns 0.2-0.5 gal/hr — avoid drive-thrus.` },
      { label: 'Annual Cost Projection', value: `At ${mpg.toFixed(1)} MPG and 12,000 mi/yr: ${annualFuel.toFixed(0)} gal. At $3.50/gal: $${annualCost.toFixed(0)}/yr. If gas hits $4.50: $${(annualFuel * 4.50).toFixed(0)}/yr. Each $1/gal increase costs you $${annualFuel.toFixed(0)} more per year.` },
      { label: 'Hypermiing Techniques', value: `Coast to stops (engine braking saves fuel). Steady throttle: accelerate gently, maintain constant speed. Anticipate traffic lights. Drafting behind trucks (safe distance only) can improve MPG 10-15% on highways. Remove unnecessary roof racks (+5% MPG). Use cruise control on flat highways.` },
      { label: 'Fuel Grade Recommendation', value: `At ${mpg.toFixed(1)} MPG, your fuel efficiency is ${mpg >= 25 ? 'within normal range' : 'below average — check if your engine requires premium fuel'}. Using the correct octane saves repair costs. If your owner's manual says "premium recommended" (not "required"), regular is fine and saves $0.50-0.80/gal.` },
      { label: 'Weight Reduction Savings', value: `Every 100 lbs reduces MPG ~1%. ${md > 300 ? 'Highway driving' : 'City driving'} is less sensitive to weight than stop-and-go. Removing a 50-lb roof rack improves highway MPG 5%. Cleaning out 200 lbs of trunk clutter saves ~$${((12000 / (mpg * 0.98) - annualFuel) * 3.50).toFixed(0)}/yr in fuel.` },
      { label: 'Trip Planning Efficiency', value: `Multiple short trips from cold starts burn 20-50% more fuel than one combined trip. Combine errands into a single loop. Warm engine adds 2-4 MPG over cold starts. Parking in the shade in summer reduces AC fuel penalty by 2-3%. Use GPS traffic-aware routing to avoid jams.` },
      { label: 'Emission & Environmental Impact', value: `This tank emitted ~${co2Tank.toFixed(0)} lbs of CO₂. Over a year: ${(annualFuel * 19.6).toFixed(0)} lbs (${(annualFuel * 19.6 / 2000).toFixed(2)} tons). Avg US car: 4.6 tons CO₂/yr. Planting ${(annualFuel * 19.6 / 48).toFixed(0)} trees offsets this tank's CO₂ (1 tree absorbs ~48 lbs CO₂/yr).` },
    ]} },
  description: 'Measure vehicle fuel economy in MPG, L/100km, and km/L from miles driven and gallons used. Includes annual cost projections, CO₂ emissions per tank, tank range estimates, efficiency classification, and actionable driving tips.',
  formula: 'MPG = Miles ÷ Gallons | L/100km = 235.215 ÷ MPG | km/L = MPG × 0.4251 | Annual Fuel (12k mi) = 12,000 ÷ MPG | Tank CO₂ = Gallons × 19.6 lbs',
  interpretation: 'Track over 3+ consecutive fill-ups for accurate average (single-tank variance up to 5 MPG). Typical sedan: 25-35 MPG, SUV: 15-25 MPG, hybrid: 40-60 MPG. Winter blend gas reduces MPG 2-4%. Every 100 lbs of cargo reduces MPG ~1%. Combining short trips saves 20-50% on warm-up fuel. Smooth driving improves MPG 15-30% in city conditions.'
}

export default calcDef

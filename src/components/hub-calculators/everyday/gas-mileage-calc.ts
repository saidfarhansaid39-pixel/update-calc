import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ milesDrivenTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gallonsUsedTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'milesDrivenTotal', label: 'Miles Driven', type: 'number', min: 1, step: '10' },
    { name: 'gallonsUsedTotal', label: 'Gallons Used', type: 'number', min: 0.1, step: '0.5' },
  ],
  defaults: { milesDrivenTotal: '320', gallonsUsedTotal: '10.5' },
  presets: [
    { label: 'Sedan (Highway)', values: { milesDrivenTotal: '385', gallonsUsedTotal: '10' } },
    { label: 'SUV (Mixed)', values: { milesDrivenTotal: '280', gallonsUsedTotal: '14' } },
    { label: 'Hybrid (City)', values: { milesDrivenTotal: '510', gallonsUsedTotal: '9.5' } },
    { label: 'Pickup Truck', values: { milesDrivenTotal: '245', gallonsUsedTotal: '14' } },
  ],
  compute: (v) => {
    const mpg = v.milesDrivenTotal / v.gallonsUsedTotal
    const l100km = 235.215 / mpg
    const kmL = mpg * 0.425144
    const costPer10k = (10000 / mpg) * 3.50
    const co2PerYear = (12000 / mpg) * 19.6
    const tankRange = mpg * 15
    return { result: mpg, label: 'Fuel Economy', unit: 'MPG', steps: [{ label: 'Miles per Gallon', value: `${mpg.toFixed(1)} MPG` }, { label: 'Liters per 100 km', value: `${l100km.toFixed(1)} L/100km` }, { label: 'Kilometers per Liter', value: `${kmL.toFixed(1)} km/L` }, { label: 'Annual Fuel (12k mi)', value: `${(12000 / mpg).toFixed(0)} gal` }, { label: 'Annual Fuel Cost', value: `$${costPer10k.toFixed(0)} at $3.50/gal` }, { label: 'Tank Range (15 gal)', value: `${tankRange.toFixed(0)} mi` }, { label: 'CO₂ per Year', value: `${co2PerYear.toFixed(0)} lbs CO₂` }, { label: 'Fuel Economy Rating', value: `${mpg >= 40 ? 'Excellent' : mpg >= 30 ? 'Good' : mpg >= 20 ? 'Average' : 'Below Average'}` }] ,
    extras: [
      { label: 'Multi-Tank Accuracy', value: `Single tank readings vary up to 5 MPG due to pump shutoff timing. Track 3+ consecutive fill-ups for true average: reset trip meter at each fill, sum miles ÷ sum gallons. Your ${v.milesDrivenTotal} mi / ${v.gallonsUsedTotal} gal = ${mpg.toFixed(1)} MPG is ${v.gallonsUsedTotal > 10 ? 'more reliable (larger sample)' : 'a single data point — track 2 more tanks'}.` },
      { label: 'Driving Style Impact', value: `Aggressive driving (hard acceleration, late braking) lowers MPG by 15-30% in city driving. Smooth driving: anticipate stops, maintain steady speed. On this tank, ${v.milesDrivenTotal > 300 ? 'highway miles likely boosted your average' : 'city miles likely reduced it'}. Gentle throttle saves ~$${(12000 / mpg * 3.50 * 0.2).toFixed(0)}/yr.` },
      { label: 'Tire Pressure Check', value: `Low tire pressure costs 0.2% MPG per 1 PSI below spec (avg 4 PSI low = ~3% loss = ~$$${(12000 / (mpg * 0.97) * 3.50).toFixed(0)} vs $$${(12000 / mpg * 3.50).toFixed(0)}/yr). Check monthly when tires are cold. Proper pressure also extends tire life by 5,000+ miles.` },
      { label: 'Fuel Type & Octane', value: `Using premium in an engine designed for regular wastes $0.50-0.80/gal with zero MPG benefit. If your car requires regular (87 octane), using premium won't improve MPG. If it requires premium, using regular may reduce MPG 2-4% and risk engine knock.` },
      { label: 'Seasonal MPG Variation', value: `Winter blend gas reduces MPG 2-4% due to lower BTU content. Cold engines run rich for the first 3-5 miles, further reducing city MPG 10-20% in winter. Summer AC at highway speeds adds 1-4% fuel use. Your ${mpg.toFixed(1)} MPG reading may vary +/- 3 MPG by season alone.` },
      { label: 'Maintenance Schedule', value: `A dirty air filter reduces MPG by up to 10% in older cars. Worn spark plugs can cost 5-10% MPG. Underinflated tires lose 0.2% per PSI. Using the wrong oil viscosity (e.g., 10W-40 instead of 5W-30) costs 1-2% MPG. Regular maintenance saves 5-15% on fuel.` },
      { label: 'Comparison to Fleet Avg', value: `US avg: 25.4 MPG (2024 fleet). Your ${mpg.toFixed(1)} MPG is ${mpg > 25.4 ? `${((mpg / 25.4 - 1) * 100).toFixed(0)}% better than average — saving $${(((12000 / 25.4) - (12000 / mpg)) * 3.50).toFixed(0)}/yr` : `${((1 - mpg / 25.4) * 100).toFixed(0)}% below average — costing $${(((12000 / mpg) - (12000 / 25.4)) * 3.50).toFixed(0)}/yr extra`}.` },
      { label: 'Cargo Weight Effect', value: `Every 100 lbs of cargo reduces MPG by ~1%. At ${mpg.toFixed(1)} MPG, adding 200 lbs of cargo drops you to ~${(mpg * 0.98).toFixed(1)} MPG — costing $${((12000 / (mpg * 0.98) - 12000 / mpg) * 3.50).toFixed(0)} extra per year. Remove unnecessary roof racks and heavy items from the trunk.` },
    ]}
  },
  description: 'Calculate vehicle fuel economy from miles driven and gallons used. Get your MPG, L/100km, km/L, annual fuel cost projections, CO₂ emissions, tank range estimates, and performance benchmarks against fleet averages.',
  formula: 'MPG = Miles Driven ÷ Gallons Used | L/100km = 235.215 ÷ MPG | km/L = MPG × 0.4251 | Annual Fuel = 12,000 ÷ MPG | CO₂ = Gallons × 19.6 lbs | Tank Range = MPG × 15 gal',
  interpretation: 'Track mileage over 3+ consecutive fill-ups for accuracy (single-tank variance up to 5 MPG). Aggressive driving reduces MPG by 15-30%. Proper tire inflation saves 3%. Winter blend gas costs 2-4% MPG. The US fleet average is 25.4 MPG. Every 100 lbs of cargo reduces MPG ~1%. Combining MPG tracking with maintenance schedules can save 10-25% on annual fuel costs.'
}

export default calcDef

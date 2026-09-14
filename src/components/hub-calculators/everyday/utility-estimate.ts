import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ uesHouseSize: z.string().min(1), uesSeason: z.string().min(1), uesPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), uesHeatingType: z.string().min(1) }),
  fields: [
    { name: 'uesHouseSize', label: 'Home Size', type: 'select', options: [{ label: 'Apartment (<750 sqft)', value: 'apt' }, { label: 'Small Home (750-1,200 sqft)', value: 'small' }, { label: 'Medium Home (1,201-2,000 sqft)', value: 'medium' }, { label: 'Large Home (2,001-3,000 sqft)', value: 'large' }, { label: 'Mansion (3,000+ sqft)', value: 'mansion' }] },
    { name: 'uesSeason', label: 'Season', type: 'select', options: [{ label: 'Winter (peak)', value: 'winter' }, { label: 'Summer (peak)', value: 'summer' }, { label: 'Spring/Fall (mild)', value: 'mild' }] },
    { name: 'uesPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'uesHeatingType', label: 'Heating/Cooling Type', type: 'select', options: [{ label: 'Electric (HVAC/Heat Pump)', value: 'electric' }, { label: 'Natural Gas Furnace', value: 'gas' }, { label: 'Oil/Propane', value: 'oil' }, { label: 'Geothermal/Solar', value: 'green' }] },
  ],
  defaults: { uesHouseSize: 'medium', uesSeason: 'mild', uesPeople: '2', uesHeatingType: 'electric' },
  presets: [
    { label: '1BR Apt, Winter Electric', values: { uesHouseSize: 'apt', uesSeason: 'winter', uesPeople: '1', uesHeatingType: 'electric' } },
    { label: 'Family Home, Summer AC', values: { uesHouseSize: 'medium', uesSeason: 'summer', uesPeople: '4', uesHeatingType: 'electric' } },
    { label: 'Large Home, Gas Heat Winter', values: { uesHouseSize: 'large', uesSeason: 'winter', uesPeople: '4', uesHeatingType: 'gas' } },
    { label: 'Eco-Home, Geothermal', values: { uesHouseSize: 'medium', uesSeason: 'mild', uesPeople: '3', uesHeatingType: 'green' } },
  ],
  compute: (v) => {
    const sizeBase: Record<string, number> = { apt: 80, small: 120, medium: 170, large: 230, mansion: 350 }
    const seasonFactors: Record<string, number> = { winter: 1.4, summer: 1.3, mild: 0.85 }
    const heatingCostFactors: Record<string, number> = { electric: 1, gas: 0.8, oil: 1.2, green: 0.5 }
    const base = sizeBase[v.uesHouseSize] || 170
    const seasonAdj = seasonFactors[v.uesSeason] || 1
    const heatingAdj = heatingCostFactors[v.uesHeatingType] || 1
    const peopleFactor = 1 + (v.uesPeople - 1) * 0.15
    const estimatedBill = base * seasonAdj * heatingAdj * peopleFactor
    const low = estimatedBill * 0.85
    const high = estimatedBill * 1.15
    return { result: estimatedBill, label: 'Estimated Utility Bill', unit: '$', steps: [{ label: 'Home Size Base', value: `${v.uesHouseSize} = $${base.toFixed(0)}` }, { label: 'Season Multiplier', value: `${v.uesSeason} = ${seasonAdj}x` }, { label: 'Heating/Cooling Type', value: `${v.uesHeatingType} = ${heatingAdj}x` }, { label: 'Occupant Factor', value: `${v.uesPeople} people = ${peopleFactor.toFixed(2)}x` }, { label: 'Estimated Monthly', value: `$${base.toFixed(0)} × ${seasonAdj} × ${heatingAdj} × ${peopleFactor.toFixed(2)} = $${estimatedBill.toFixed(0)}` }, { label: 'Typical Monthly Range', value: `$${low.toFixed(0)} – $${high.toFixed(0)}` }, { label: 'Annual Estimate', value: `$${(estimatedBill * 12).toFixed(0)}/year ($${(estimatedBill * 12 / 12).toFixed(0)}/month avg)` }] ,
    extras: [
      { label: 'Heating Cost Comparison', value: 'Natural gas is typically 20-40% cheaper than electric resistance heating. Heat pumps (electric) are 2-3× more efficient than resistance but less efficient in sub-freezing temps. Geothermal: 300-500% efficient but $15,000-30,000 installation. Oil: 30-50% more than gas.' },
      { label: 'Seasonal Utility Spikes', value: 'Winter utility bills are typically 30-50% higher than mild season due to heating. Summer bills spike 25-35% from AC. Spring/fall (mild): lowest usage — windows open, minimal HVAC. Budget $200-400/month in peak seasons vs $120-200 in mild months.' },
      { label: 'Occupant Impact on Utilities', value: 'Each additional person adds ~15% to utility costs: more hot water (+$10-20/mo), more electronics (+$5-15/mo), more laundry (+$5-10/mo), more cooking (+$5-10/mo). A 4-person home pays ~45% more than a 2-person home for the same square footage.' },
      { label: 'Energy Efficiency Upgrades', value: 'Programmable thermostat: saves $100-180/year on HVAC (payback 6-12 months). LED bulbs: 75% less energy than incandescent — $75/year savings for average home. Attic insulation: 20-30% reduction in heating/cooling costs. Air sealing: 10-20% savings.' },
      { label: 'Appliance Energy Hogs', value: 'HVAC: 46% of home energy. Water heater: 14%. Washer/dryer: 13%. Lighting: 9%. Refrigerator: 7%. Electronics: 6%. Cooking: 5%. Focus reduction on HVAC (programmable thermostat, regular filter changes) and water heater (120°F, tank insulation) for biggest savings.' },
      { label: 'Regional Utility Rate Differences', value: 'US electric rates: 10-12¢/kWh (national avg). Highest: Hawaii 40¢, CA 25¢, NY 20¢. Lowest: ID 9¢, ND 9¢, WA 10¢. Gas rates: $1-2/therm. Water: $5-15/kgal. The same home with same usage can cost 3× more in a high-rate state than a low-rate state.' },
      { label: 'Budget Billing Programs', value: 'Many utilities offer levelized/budget billing — pay the same amount each month based on annual average. Avoids winter/summer spikes. At year-end, you may owe a true-up if actual usage exceeds projections. Typically allows 2-4% annual adjustment.' },
    ]}
  },
  description: 'Quick utility bill estimate based on home size, season, occupant count, and heating/cooling type. Get a realistic monthly estimate with range and annual projection for household budgeting.',
  formula: 'EstimatedBill = SizeBase($) × SeasonFactor × HeatingFactor × (1 + (Occupants - 1) × 0.15). Range = EstimatedBill ± 15%. Season factors: Winter 1.4, Summer 1.3, Mild 0.85. Heating factors: Electric 1.0, Gas 0.8, Oil 1.2, Geo/Solar 0.5.',
  interpretation: 'A medium home (1,200-2,000 sq ft) with 2 occupants, electric HVAC in mild season: $170 × 1.0 × 1.0 × 1.15 = $196/month. In winter with same setup: $170 × 1.4 × 1.0 × 1.15 = $274/month. Switching to gas heat in winter: $170 × 1.4 × 0.8 × 1.15 = $219/month — saving $55/month (20%). A geothermal system in winter: $170 × 1.4 × 0.5 × 1.15 = $137/month — saving 50% vs electric. These estimates align with national averages of $200-400/month for typical homes. Actual bills vary based on local rates, thermostat settings, insulation quality, and appliance efficiency.'
}

export default calcDef

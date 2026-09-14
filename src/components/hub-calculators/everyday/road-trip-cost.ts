import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vehicleMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tolls: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), maintenancePerMile: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalMiles', label: 'Total Miles', type: 'number', min: 50, step: '50' },
    { name: 'vehicleMpg', label: 'Vehicle MPG', type: 'number', min: 10, step: '5' },
    { name: 'fuelPrice', label: 'Fuel Price ($/gal)', type: 'number', min: 1, step: '0.5' },
    { name: 'tolls', label: 'Total Tolls ($)', type: 'number', min: 0, step: '5' },
    { name: 'maintenancePerMile', label: 'Maintenance per Mile ($)', type: 'number', min: 0, step: '0.01' },
  ],
  defaults: { totalMiles: '500', vehicleMpg: '25', fuelPrice: '3.5', tolls: '0', maintenancePerMile: '0.09' },
  presets: [
    { label: 'Fuel-Efficient Car', values: { totalMiles: '500', vehicleMpg: '35', fuelPrice: '3.5', tolls: '25', maintenancePerMile: '0.06' } },
    { label: 'SUV/Truck Trip', values: { totalMiles: '500', vehicleMpg: '18', fuelPrice: '3.5', tolls: '0', maintenancePerMile: '0.12' } },
    { label: 'EV Road Trip', values: { totalMiles: '500', vehicleMpg: '100', fuelPrice: '1.2', tolls: '0', maintenancePerMile: '0.04' } },
    { label: 'Long Haul Trucker', values: { totalMiles: '2000', vehicleMpg: '22', fuelPrice: '3.3', tolls: '80', maintenancePerMile: '0.10' } },
  ],
  compute: (v) => {
    const fuelCost = (v.totalMiles / v.vehicleMpg) * v.fuelPrice
    const maintCost = v.totalMiles * v.maintenancePerMile
    const total = fuelCost + v.tolls + maintCost
    const costPerMile = total / v.totalMiles
    return { result: total, label: 'Total Driving Cost', unit: '$', steps: [{ label: 'Fuel Cost', value: `$${fuelCost.toFixed(2)}` }, { label: 'Maintenance', value: `$${maintCost.toFixed(2)}` }, { label: 'Tolls', value: `$${v.tolls.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Cost per Mile', value: `$${costPerMile.toFixed(3)}` }] ,
    extras: [
      { label: 'IRS Mileage Rate Context', value: 'IRS 2024 standard mileage rate: $0.655/mi (includes fuel, maintenance, depreciation, insurance). Actual fuel-only cost: $0.08-0.25/mi depending on vehicle efficiency and gas prices' },
      { label: 'Vehicle Type Cost Comparison', value: 'Fuel-efficient car: $0.08-0.12/mi fuel. SUV: $0.15-0.25/mi fuel. EV: $0.03-0.05/mi charging (at $0.14/kWh home rate). Hybrid: $0.06-0.10/mi fuel. Insurance: $0.05-0.10/mi additional' },
      { label: 'Depreciation Factor', value: 'Vehicle depreciation: $0.15-0.35/mi for new cars. This is the largest hidden driving cost. A $35,000 car driven 150k miles depreciates $0.23/mi. Total cost including depreciation: $0.55-0.85/mi' },
      { label: 'Toll Road Planning', value: 'Major toll routes: Northeast (PA Tpk, NY Thruway, NJ Tpk): $20-60 for 300 mi. Florida Tpk: $15-30 for 200 mi. Use Waze/Google Maps to compare toll vs non-toll routes. E-ZPass saves 30-50% vs plate billing' },
      { label: 'EV vs Gas Comparison', value: 'EV at $0.14/kWh home charging: $0.04-0.06/mi. Gas at $3.50/gal: $0.10-0.20/mi (25 MPG). On a 500-mi trip: EV costs $20-30 vs gas $50-100. Public fast charging ($0.30-0.50/kWh) doubles EV cost' },
      { label: 'Maintenance Cost Factors', value: 'Average maintenance: $0.06-0.12/mi. New car warranty covers 3-36k mi. Major services (60k/90k mi): $500-2,000. Tires: $400-1,200 every 40-60k mi. Brakes: $300-800 every 50-70k mi. Oil changes: $0.01-0.02/mi' },
      { label: 'Total Cost Considerations', value: 'For a true cost comparison vs alternatives: add parking ($0-30/day), insurance ($0.05-0.10/mi), and depreciation ($0.15-0.35/mi) to your driving calculation. Total true cost: $0.40-0.85/mi vs rental car $0.30-0.70/mi or rideshare $1.50-3.00/mi' },
    ]}
  },
  description: 'Calculate true driving costs including fuel, vehicle maintenance, and tolls. Compare fuel-only costs with total ownership costs per mile.',
  formula: 'FuelCost = (TotalMiles ÷ MPG) × FuelPrice. MaintCost = TotalMiles × MaintPerMile. TotalDrivingCost = FuelCost + MaintCost + Tolls. CostPerMile = Total ÷ TotalMiles.',
  interpretation: 'A 500-mile trip in a 25 MPG vehicle at $3.50/gal: fuel = $70 (20 gal), maintenance at $0.09/mi = $45, total = $115 before tolls ($0.23/mi). The true cost of driving includes much more: the IRS rates driving at $0.655/mi (2024) including fuel, maintenance, depreciation, and insurance. On this 500-mile trip, the true cost is $327.50 — far more than just fuel. EVs significantly reduce fuel costs ($0.04-0.06/mi vs $0.10-0.20/mi for gas) and maintenance (no oil changes, fewer moving parts). Compare with alternatives: rental car at $0.30-0.70/mi or rideshare at $1.50-3.00/mi. For frequent trips, your own car is almost always cheapest when you own it outright.'
}

export default calcDef

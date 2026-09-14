import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ accDistKm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accDaysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accFuelEff: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accFuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accParkingDaily: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), accTollsDaily: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'accDistKm', label: 'One-Way Distance (km)', type: 'number', min: 1, step: '5' },
    { name: 'accDaysPerWeek', label: 'Days Commuting per Week', type: 'number', min: 1, max: 7, step: '1' },
    { name: 'accFuelEff', label: 'Fuel Efficiency (km/L)', type: 'number', min: 5, step: '1' },
    { name: 'accFuelPrice', label: 'Fuel Price per Liter ($)', type: 'number', min: 0.5, step: '0.1' },
    { name: 'accParkingDaily', label: 'Daily Parking Cost ($)', type: 'number', min: 0, step: '2' },
    { name: 'accTollsDaily', label: 'Daily Tolls ($)', type: 'number', min: 0, step: '1' },
  ],
  defaults: { accDistKm: '15', accDaysPerWeek: '5', accFuelEff: '12', accFuelPrice: '1.5', accParkingDaily: '5', accTollsDaily: '0' },
  presets: [
    { label: 'Short Urban Commute', values: { accDistKm: '8', accDaysPerWeek: '5', accFuelEff: '10', accFuelPrice: '1.6', accParkingDaily: '8', accTollsDaily: '2' } },
    { label: 'Long Highway Drive', values: { accDistKm: '40', accDaysPerWeek: '5', accFuelEff: '14', accFuelPrice: '1.4', accParkingDaily: '0', accTollsDaily: '5' } },
    { label: 'Hybrid WFH Commute', values: { accDistKm: '20', accDaysPerWeek: '3', accFuelEff: '12', accFuelPrice: '1.5', accParkingDaily: '10', accTollsDaily: '0' } },
    { label: 'Fuel-Efficient Car', values: { accDistKm: '25', accDaysPerWeek: '5', accFuelEff: '18', accFuelPrice: '1.55', accParkingDaily: '5', accTollsDaily: '3' } },
  ],
  compute: (v) => {
    const dailyDist = v.accDistKm * 2
    const dailyFuel = dailyDist / v.accFuelEff
    const dailyFuelCost = dailyFuel * v.accFuelPrice
    const dailyTotal = dailyFuelCost + v.accParkingDaily + v.accTollsDaily
    const weekly = dailyTotal * v.accDaysPerWeek
    const monthly = weekly * 4.33
    const annual = weekly * 52
    const annualKm = dailyDist * v.accDaysPerWeek * 52
    const costPerKm = dailyTotal / dailyDist
    const co2Kg = dailyFuel * 2.31 * v.accDaysPerWeek * 52
    return { result: monthly, label: 'Monthly Commute Cost', unit: '$', steps: [{ label: 'Round Trip Distance', value: `${v.accDistKm} km × 2 = ${dailyDist} km` }, { label: 'Daily Fuel Used', value: `${dailyDist} km / ${v.accFuelEff} km/L = ${dailyFuel.toFixed(2)} L` }, { label: 'Daily Fuel Cost', value: `${dailyFuel.toFixed(2)} L × $${v.accFuelPrice.toFixed(2)} = $${dailyFuelCost.toFixed(2)}` }, { label: 'Daily Parking + Tolls', value: `$${v.accParkingDaily.toFixed(2)} + $${v.accTollsDaily.toFixed(2)} = $${(v.accParkingDaily + v.accTollsDaily).toFixed(2)}` }, { label: 'Total Daily Cost', value: `$${dailyFuelCost.toFixed(2)} + $${(v.accParkingDaily + v.accTollsDaily).toFixed(2)} = $${dailyTotal.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${dailyTotal.toFixed(2)} × ${v.accDaysPerWeek} × 4.33 = $${monthly.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annual.toFixed(2)}` }, { label: 'Cost per km', value: `$${costPerKm.toFixed(3)}/km` }] ,
    extras: [
      { label: 'Hidden Vehicle Depreciation', value: 'Beyond fuel and tolls, driving adds $0.08-0.15/km in wear & tear (tires, brakes, oil). At your distance, that is ~$' + `${(costPerKm * dailyDist * v.accDaysPerWeek * 52).toFixed(0)}` + '/year in hidden costs.' },
      { label: 'WFH Savings Potential', value: `Reducing from ${v.accDaysPerWeek} to 3 days/week saves $${(dailyTotal * (v.accDaysPerWeek - 3) * 4.33).toFixed(0)}/month. Each remote day saves you $${(dailyTotal * 1).toFixed(2)} directly.` },
      { label: 'Carpool Calculation', value: 'A 2-person carpool cuts your fuel, parking, and toll costs by ~45-50%. With your numbers: ~$' + `${(monthly * 0.475).toFixed(0)}` + '/month vs current.' },
      { label: 'Public Transit Comparison', value: `A monthly transit pass costs $70-130 in most cities. Your commute costs $${monthly.toFixed(0)}/month — transit saves $${(monthly - 100).toFixed(0)}/month if a pass fits your route.` },
      { label: 'Electric Vehicle Math', value: 'An EV at 6 km/kWh ($0.14/kWh) costs ~$' + `${(dailyDist / 6 * 0.14 * v.accDaysPerWeek * 4.33).toFixed(0)}` + '/month vs $' + `${monthly.toFixed(0)}` + ' for gas. Savings: ~$' + `${(monthly - (dailyDist / 6 * 0.14 * v.accDaysPerWeek * 4.33)).toFixed(0)}` + '/month on fuel.' },
      { label: 'Carbon Footprint', value: `Your commute emits ~${co2Kg.toFixed(0)} kg CO₂/year. That is equivalent to ${(co2Kg / 1000 / 4.6).toFixed(1)} cars worth of annual emissions. Telecommuting 2 days/week cuts this by 40%.` },
      { label: 'Toll Pass Savings', value: 'If tolls are part of your route, an electronic pass (e.g., E-ZPass) saves 20-30% vs pay-per-plate. At $' + `${v.accTollsDaily.toFixed(2)}` + '/day, that is $' + `${(v.accTollsDaily * v.accDaysPerWeek * 52 * 0.25).toFixed(0)}` + '/year saved.' },
    ]}
  },
  description: 'Calculate the full cost of your commute including fuel, parking, tolls, and hidden wear-and-tear. Compare with public transit, carpooling, WFH, and EV alternatives to find your cheapest option.',
  formula: 'Daily Fuel Cost = (Dist × 2 ÷ km/L) × Fuel Price | Daily Total = Fuel + Parking + Tolls | Monthly = Daily Total × Days/Week × 4.33 | Annual = Weekly × 52',
  interpretation: 'The average commute (16 km one-way, 5 days/week) costs $150-300/month in fuel alone, or $250-450 with parking and tolls. Working from home 2 days/week saves 40%. Carpooling cuts costs by 50%. An EV reduces fuel cost by ~70%. Public transit ($70-130/month) is cheaper for city commutes. Each kilometer costs $0.10-0.30 in fuel plus $0.08-0.15 in vehicle depreciation — the true cost is ~2× the fuel cost alone.'
}

export default calcDef

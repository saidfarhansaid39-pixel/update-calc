import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), workDays: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), parkingDaily: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tollsDaily: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'distance', label: 'One-Way Distance (mi)', type: 'number', min: 1, step: '1' },
    { name: 'mpg', label: 'Vehicle MPG', type: 'number', min: 10, step: '5' },
    { name: 'fuelCost', label: 'Fuel Price ($/gal)', type: 'number', min: 1, step: '0.5' },
    { name: 'workDays', label: 'Days Worked per Month', type: 'number', min: 1, max: 31, step: '1' },
    { name: 'parkingDaily', label: 'Daily Parking ($)', type: 'number', min: 0, step: '2' },
    { name: 'tollsDaily', label: 'Daily Tolls ($)', type: 'number', min: 0, step: '1' },
  ],
  defaults: { distance: '15', mpg: '25', fuelCost: '3.5', workDays: '22', parkingDaily: '5', tollsDaily: '0' },
  presets: [
    { label: 'Short City Commute', values: { distance: '5', mpg: '22', fuelCost: '3.7', workDays: '22', parkingDaily: '10', tollsDaily: '2' } },
    { label: 'Long Highway Drive', values: { distance: '35', mpg: '30', fuelCost: '3.4', workDays: '20', parkingDaily: '0', tollsDaily: '5' } },
    { label: 'Suburban Hybrid WFH', values: { distance: '20', mpg: '28', fuelCost: '3.5', workDays: '12', parkingDaily: '0', tollsDaily: '0' } },
    { label: 'Electric Vehicle Commute', values: { distance: '25', mpg: '100', fuelCost: '0.14', workDays: '22', parkingDaily: '3', tollsDaily: '0' } },
  ],
  compute: (v) => {
    const dailyRoundTrip = v.distance * 2
    const dailyFuel = dailyRoundTrip / v.mpg
    const dailyFuelCost = dailyFuel * v.fuelCost
    const dailyTotal = dailyFuelCost + v.parkingDaily + v.tollsDaily
    const monthlyFuel = dailyFuelCost * v.workDays
    const monthlyTotal = dailyTotal * v.workDays
    const annualFuel = monthlyFuel * 12
    const annualTotal = monthlyTotal * 12
    const costPerMile = dailyTotal / dailyRoundTrip
    const irsRate = 0.655
    const irsAnnualCost = dailyRoundTrip * v.workDays * 12 * irsRate
    const trueCostBeyondFuel = irsAnnualCost - annualFuel
    const wfhSavingsPerDay = dailyTotal
    const monthlyMiles = dailyRoundTrip * v.workDays
    const annualMiles = monthlyMiles * 12
    const co2Kg = dailyFuel * 2.31 * v.workDays * 12
    return { result: monthlyTotal, label: 'Monthly Commute Cost', unit: '$', steps: [
      { label: 'Round Trip Distance', value: `${v.distance} mi × 2 = ${dailyRoundTrip} mi/day` },
      { label: 'Daily Fuel Used', value: `${dailyRoundTrip} mi ÷ ${v.mpg} mpg = ${dailyFuel.toFixed(3)} gal` },
      { label: 'Daily Fuel Cost', value: `${dailyFuel.toFixed(3)} gal × $${v.fuelCost.toFixed(2)} = $${dailyFuelCost.toFixed(2)}` },
      { label: 'Parking & Tolls', value: `$${v.parkingDaily.toFixed(2)} + $${v.tollsDaily.toFixed(2)} = $${(v.parkingDaily + v.tollsDaily).toFixed(2)}/day` },
      { label: 'Total Daily Cost', value: `$${dailyTotal.toFixed(2)}` },
      { label: `Monthly (${v.workDays} days)`, value: `$${dailyTotal.toFixed(2)} × ${v.workDays} = $${monthlyTotal.toFixed(2)}` },
      { label: 'Annual Cost', value: `$${annualTotal.toFixed(2)}` },
      { label: 'Cost per Mile', value: `$${costPerMile.toFixed(3)}/mi (IRS: $${irsRate.toFixed(3)}/mi true cost)` },
    ] ,
    extras: [
      { label: 'True Cost Beyond Fuel (IRS Method)', value: `The IRS mileage rate ($${irsRate}/mi for 2024) covers fuel, maintenance, depreciation, tires, and insurance. Your true annual commute cost: $${irsAnnualCost.toFixed(0)} — vs $${annualFuel.toFixed(0)} in fuel alone. The gap: $${(irsAnnualCost - annualFuel).toFixed(0)}/year in hidden costs ($$${(trueCostBeyondFuel / 12).toFixed(0)}/mo for depreciation, maintenance, insurance).` },
      { label: 'WFH Savings Potential', value: `Each day you work from home saves $${wfhSavingsPerDay.toFixed(2)}. Going from ${v.workDays} to 10 days/mo in-office saves $${((v.workDays - 10) * wfhSavingsPerDay).toFixed(2)}/mo. A 3-day office week (12 days/mo) vs 5-day (22 days) saves $${((22 - 12) * wfhSavingsPerDay).toFixed(0)}/mo = $${(((22 - 12) * wfhSavingsPerDay) * 12).toFixed(0)}/yr.` },
      { label: 'Carpool & Rideshare Math', value: `A 2-person carpool cuts fuel, parking, and tolls by ~45% (some extra time for pickup). At your cost: $${(monthlyTotal * 0.55).toFixed(0)}/mo vs $${monthlyTotal.toFixed(0)}. Savings: $${(monthlyTotal * 0.45).toFixed(0)}/mo. Vanpool (3-5 people): saves 60-70%. Check if your employer offers commuter benefits (pre-tax transit/parking — saves 22-32% via payroll deduction).` },
      { label: 'Public Transit Comparison', value: `Monthly transit pass: $50-150 typical. Your commute costs $${monthlyTotal.toFixed(0)}/mo. Transit saves $${(monthlyTotal - 100).toFixed(0)}-${(monthlyTotal - 50).toFixed(0)}/mo. Time trade-off: transit may take 1.3-2× longer but allows productive time (reading, email, podcasts). Factor: transit cost + time value vs driving cost + stress.` },
      { label: 'Electric Vehicle Savings', value: `An EV at 3.5 mi/kWh ($${v.fuelCost === 0.14 ? v.fuelCost.toFixed(2) : '0.14'}/kWh) costs $${(dailyRoundTrip / 3.5 * 0.14).toFixed(2)}/day vs $${dailyFuelCost.toFixed(2)} for gas. Monthly savings: $${((dailyFuelCost - dailyRoundTrip / 3.5 * 0.14) * v.workDays).toFixed(0)}. Annual savings: $${(((dailyFuelCost - dailyRoundTrip / 3.5 * 0.14) * v.workDays) * 12).toFixed(0)}. EV purchase premium ($5-15k) breaks even in ${(((dailyFuelCost - dailyRoundTrip / 3.5 * 0.14) * v.workDays * 12) > 0 ? (((5000 + 15000) / 2 / (((dailyFuelCost - dailyRoundTrip / 3.5 * 0.14) * v.workDays * 12))).toFixed(1)) : 'N/A')} years on fuel alone.` },
      { label: 'Carbon Footprint', value: `Your commute emits ~${co2Kg.toFixed(0)} kg CO₂/year (${(co2Kg / 1000).toFixed(1)} metric tons). Equivalent to: ${(co2Kg / 1000 / 4.6).toFixed(1)} cars, ${(co2Kg / 1000 / 0.4).toFixed(1)} trees needed to offset, or ${(co2Kg / 1000 * 1.5).toFixed(1)} NYC-London flights. WFH 2 days/week cuts emissions by 40% = ${(co2Kg * 0.4 / 1000).toFixed(1)} fewer tons/year.` },
      { label: 'Time Cost of Commuting', value: `At ${dailyRoundTrip} mi/day, assuming avg 30 mph: ${(dailyRoundTrip / 30 * 60).toFixed(0)} min/day commuting = ${((dailyRoundTrip / 30) * v.workDays).toFixed(1)} hrs/mo = ${(((dailyRoundTrip / 30) * v.workDays * 12) / 24).toFixed(1)} days/year in the car. At $25/hr time value, that's $${((dailyRoundTrip / 30) * v.workDays * 12 * 25).toFixed(0)}/year in lost time.` },
      { label: 'Toll Pass Savings', value: v.tollsDaily > 0 ? `At $${v.tollsDaily.toFixed(2)}/day in tolls, an electronic pass (E-ZPass, TollTag) saves 20-40% vs pay-by-plate. Annualized: $${(v.tollsDaily * v.workDays * 12 * 0.3).toFixed(0)} saved with a pass. Dynamic toll lanes: $2-8 during peak vs $1-3 off-peak. Shifting your schedule 30 min can cut toll costs by 40-60%.` : 'No tolls on your route. If you ever choose a toll route for speed, calculate: time saved (min) × value of time vs toll cost. General rule: a toll is worth it if time saved × $25/hr > toll cost.' },
    ]}
  },
  description: 'Calculate your true daily, monthly, and annual commute cost including fuel, parking, tolls, and hidden vehicle expenses. Compare against IRS mileage rate, public transit, carpooling, EV, and WFH scenarios. Includes carbon footprint and time cost analysis.',
  formula: 'Daily Fuel = (Distance × 2 ÷ MPG) × Fuel Price. Daily Total = Fuel + Parking + Tolls. Monthly = Daily × Days Worked. Annual = Monthly × 12. Cost/Mile = Total ÷ (Distance × 2). IRS True Cost = Miles × $0.655.',
  interpretation: 'The IRS mileage rate ($0.655/mi for 2024) covers fuel, maintenance, tires, insurance, and depreciation — your true cost is 2-3× the fuel cost alone. Average US commute: 15 mi one-way, $150-300/mo in fuel, $300-600/mo true cost. WFH 2 days/week saves 40% ($1,200-3,000/yr). An EV cuts fuel cost by 60-80% (3-4¢/mi vs 12-18¢/mi for gas). Carpooling with 1 person saves ~45% of variable costs. Transit (when available) saves $50-200/mo. Time cost: avg commute adds 200+ hours/year in unpaid travel time.'
}

export default calcDef

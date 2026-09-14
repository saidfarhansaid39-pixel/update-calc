import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ acPower: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), hoursPerDay: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), ratePerKwh: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'acPower', label: 'AC Power (watts)', type: 'number', min: 500, step: '100' },
    { name: 'hoursPerDay', label: 'Hours Used Per Day', type: 'number', min: 0.5, step: '0.5' },
    { name: 'ratePerKwh', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
  ],
  defaults: { acPower: '3500', hoursPerDay: '8', ratePerKwh: '0.14' },
  presets: [
    { label: 'Central AC (3.5 kW)', values: { acPower: '3500', hoursPerDay: '8', ratePerKwh: '0.14' } },
    { label: 'Window Unit (1 kW)', values: { acPower: '1000', hoursPerDay: '6', ratePerKwh: '0.14' } },
    { label: 'Mini-Split (2 kW)', values: { acPower: '2000', hoursPerDay: '10', ratePerKwh: '0.12' } },
  ],
  compute: (v) => {
    const kW = v.acPower / 1000
    const dailyKwh = kW * v.hoursPerDay
    const dailyCost = dailyKwh * v.ratePerKwh
    const monthlyCost = dailyCost * 30
    const annualCost = monthlyCost * 12
    const co2Lbs = dailyKwh * 0.92 * 30
    return { result: monthlyCost, label: 'Monthly Cost', unit: '$', steps: [
      { label: '1. Convert watts to kW', value: `${v.acPower} W ÷ 1000 = ${kW.toFixed(2)} kW` },
      { label: '2. Daily consumption', value: `${kW.toFixed(2)} kW × ${v.hoursPerDay} hrs = ${dailyKwh.toFixed(2)} kWh` },
      { label: '3. Daily cost', value: `${dailyKwh.toFixed(2)} kWh × $${v.ratePerKwh} = $${dailyCost.toFixed(2)}` },
      { label: '4. Monthly consumption', value: `${dailyKwh.toFixed(2)} kWh × 30 days = ${(dailyKwh*30).toFixed(1)} kWh` },
      { label: '5. Monthly cost', value: `${(dailyKwh*30).toFixed(1)} kWh × $${v.ratePerKwh} = $${monthlyCost.toFixed(2)}` },
      { label: '6. Annual projection', value: `$${monthlyCost.toFixed(2)} × 12 = $${annualCost.toFixed(2)}/yr` },
      { label: '7. CO₂ footprint', value: `${(dailyKwh*30).toFixed(0)} kWh/mo × 0.92 lbs/kWh = ${co2Lbs.toFixed(0)} lbs CO₂/mo` },
    ] ,
    extras: [
      { label: "Thermostat Savings", value: "Each degree above 72°F saves 3-5% on cooling costs. Set to 78°F when home, 82°F when away." },
      { label: "Filter Maintenance", value: "Replace or clean AC filters every 1-3 months. Dirty filters increase energy use by 5-15%." },
      { label: "Ceiling Fan Combo", value: "Use ceiling fans with AC so you can raise the thermostat 4°F without feeling warmer, saving ~20%." },
      { label: "Peak Hours", value: "Run AC during off-peak hours (before 2pm, after 7pm) if your utility has time-of-use rates." },
      { label: "SEER Rating", value: "Newer units with SEER 16+ are 30-50% more efficient than older SEER 8-10 units. Consider upgrading if your unit is 10+ years old." },
      { label: "Window Shading", value: "Close blinds/curtains on south/west windows during summer. This can reduce cooling needs by up to 30%." },
      { label: "Annual Tune-Up", value: "Professional HVAC maintenance ($80-150/year) improves efficiency 5-10% and prevents costly breakdowns." },
      { label: "Smart Thermostat", value: "Programmable/smart thermostats save $100-180/year by automatically adjusting temperatures when you're asleep or away." },
    ]}
  },
  description: 'Calculate the monthly operating cost of an air conditioner based on power rating, usage hours, and local electricity rate. Includes CO₂ footprint estimation.',
  formula: 'Monthly Cost = (Watts ÷ 1000) × Hours/Day × Rate/kWh × 30 | CO₂ = kWh × 0.92 lbs/kWh',
  interpretation: 'Central AC (3000-5000W) costs $30-90/month. Window units (500-1500W) cost $10-40/month. Set thermostat 78°F when home, use ceiling fans, and change filters monthly to save up to 30%.'
}

export default calcDef

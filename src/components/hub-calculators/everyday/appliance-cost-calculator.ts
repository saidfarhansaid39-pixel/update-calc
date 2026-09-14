import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ watts: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), hours: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), rate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), days: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'watts', label: 'Appliance Wattage (watts)', type: 'number', min: 1, step: '10' },
    { name: 'hours', label: 'Hours Used Per Day', type: 'number', min: 0.1, step: '0.5' },
    { name: 'rate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'days', label: 'Days Used Per Month', type: 'number', min: 1, max: 31, step: '1' },
  ],
  defaults: { watts: '150', hours: '8', rate: '0.14', days: '30' },
  presets: [
    { label: 'Refrigerator (150W)', values: { watts: '150', hours: '24', rate: '0.14', days: '30' } },
    { label: 'Clothes Washer (500W)', values: { watts: '500', hours: '1', rate: '0.14', days: '12' } },
    { label: 'LED TV 55" (100W)', values: { watts: '100', hours: '5', rate: '0.14', days: '30' } },
    { label: 'Gaming PC (400W)', values: { watts: '400', hours: '4', rate: '0.14', days: '25' } },
  ],
  compute: (v) => {
    const kW = v.watts / 1000
    const dailyKwh = kW * v.hours
    const monthlyKwh = dailyKwh * v.days
    const dailyCost = dailyKwh * v.rate
    const monthlyCost = monthlyKwh * v.rate
    const annualCost = monthlyCost * 12
    const dailyCostCents = dailyCost * 100
    return { result: monthlyCost, label: 'Monthly Cost', unit: '$', steps: [
      { label: '1. Convert to kilowatts', value: `${v.watts} W ÷ 1000 = ${kW.toFixed(3)} kW` },
      { label: '2. Daily energy consumption', value: `${kW.toFixed(3)} kW × ${v.hours} hrs = ${dailyKwh.toFixed(3)} kWh` },
      { label: '3. Monthly energy consumption', value: `${dailyKwh.toFixed(3)} kWh × ${v.days} days = ${monthlyKwh.toFixed(1)} kWh` },
      { label: '4. Daily cost', value: `${dailyKwh.toFixed(3)} kWh × $${v.rate} = $${dailyCost.toFixed(2)} (${dailyCostCents.toFixed(1)}¢/day)` },
      { label: '5. Monthly cost', value: `${monthlyKwh.toFixed(1)} kWh × $${v.rate} = $${monthlyCost.toFixed(2)}` },
      { label: '6. Annual cost', value: `$${monthlyCost.toFixed(2)} × 12 = $${annualCost.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Energy Star Savings", value: "Energy Star certified appliances use 10-50% less energy than standard models. A star-rated fridge saves $30-80/year vs a 10-year-old model." },
      { label: "Phantom Load", value: "Many appliances draw power even when off — TV (5W), game console (10W), laptop charger (3W). Unplug or use smart strips to save $50-100/year." },
      { label: "Time-of-Use Rates", value: "Run high-wattage appliances (washer, dryer, dishwasher) during off-peak hours (before 2pm, after 7pm) when rates are 20-40% lower." },
      { label: "Appliance Lifespan", value: "Major appliances last 8-15 years. Older units are significantly less efficient. Replace if repair costs exceed 50% of replacement value." },
      { label: "Wattage Lookup", value: "Check the yellow EnergyGuide label or use a plug-in watt meter ($15-25) to measure actual consumption. Nameplate ratings are maximums, not averages." },
      { label: "Cold Water Savings", value: "Washing clothes in cold water saves $30-60/year on electric water heating. Modern detergents work well at all temperatures." },
      { label: "Load Size Matters", value: "Run full loads only. A half-full dishwasher uses the same energy as a full one. Air-dry dishes instead of heat-dry to save 15-50% per cycle." },
      { label: "Solar Compatibility", value: "If you have solar panels, run energy-intensive appliances during peak sun hours (10am-2pm) to maximize self-consumption and minimize grid imports." },
    ]}
  },
  description: 'Calculate the electricity cost of any household appliance based on wattage, daily usage, usage days, and your local electric rate. Includes daily and annual projections.',
  formula: 'Cost = (Watts ÷ 1000) × Hours/Day × Days × Rate/kWh',
  interpretation: 'Common appliances: fridge 150W ($5-10/mo), washer 500W ($3-8/mo), TV 100W ($2-5/mo), gaming PC 400W ($5-15/mo). Energy Star saves 10-50%. Unplug idle devices to eliminate phantom loads.'
}

export default calcDef

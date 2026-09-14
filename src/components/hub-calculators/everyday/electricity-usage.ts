import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ applianceWatts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysPerMonth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'applianceWatts', label: 'Appliance Wattage (W)', type: 'number', min: 1, step: '10' },
    { name: 'hoursPerDay', label: 'Hours Used per Day', type: 'number', min: 0.1, step: '0.5' },
    { name: 'daysPerMonth', label: 'Days Used per Month', type: 'number', min: 1, max: 31, step: '1' },
  ],
  defaults: { applianceWatts: '100', hoursPerDay: '4', daysPerMonth: '30' },
  presets: [
    { label: 'Refrigerator (24/7)', values: { applianceWatts: '150', hoursPerDay: '24', daysPerMonth: '30' } },
    { label: 'Window AC Unit', values: { applianceWatts: '1200', hoursPerDay: '8', daysPerMonth: '30' } },
    { label: 'Gaming PC + Monitor', values: { applianceWatts: '400', hoursPerDay: '5', daysPerMonth: '28' } },
    { label: 'LED Light Bulb', values: { applianceWatts: '10', hoursPerDay: '6', daysPerMonth: '30' } },
  ],
  compute: (v) => {
    const dailyKwh = v.applianceWatts * v.hoursPerDay / 1000
    const monthlyKwh = dailyKwh * v.daysPerMonth
    const annualKwh = monthlyKwh * 12
    const wattsPer1000 = v.applianceWatts / 1000
    const monthlyCost15 = monthlyKwh * 0.15
    const annualCost15 = annualKwh * 0.15
    const dailyWh = v.applianceWatts * v.hoursPerDay
    const monthlyWh = dailyWh * v.daysPerMonth
    const avgWattPerDay = monthlyKwh > 0 ? (monthlyKwh * 1000) / (v.daysPerMonth * 24) : 0
    return { result: monthlyKwh, label: 'Monthly Energy Usage', unit: 'kWh', steps: [
      { label: 'Appliance Power', value: `${v.applianceWatts} W (${v.applianceWatts / 1000} kW)` },
      { label: 'Daily Run Time', value: `${v.hoursPerDay} hrs/day` },
      { label: 'Daily Consumption', value: `${v.applianceWatts} W × ${v.hoursPerDay} hrs / 1000 = ${dailyKwh.toFixed(4)} kWh` },
      { label: 'Days per Month', value: `${v.daysPerMonth} days` },
      { label: 'Monthly Consumption', value: `${dailyKwh.toFixed(4)} × ${v.daysPerMonth} = ${monthlyKwh.toFixed(2)} kWh` },
      { label: 'Annual Consumption', value: `${annualKwh.toFixed(1)} kWh` },
      { label: 'Est. Monthly Cost (at $0.15/kWh)', value: `$${monthlyCost15.toFixed(2)}` },
      { label: 'Est. Annual Cost (at $0.15/kWh)', value: `$${annualCost15.toFixed(2)}` },
    ] ,
    extras: [
      { label: "How to Read Appliance Labels", value: "Look for the UL or Energy Guide label. Wattage is usually printed near the power cord or on the back panel. If only amps are listed: Watts = Volts × Amps (US standard: 120V for small appliances, 240V for large). Example: 5A × 120V = 600W." },
      { label: "Kill-A-Watt Meter Guide", value: "For $20-35, a Kill-A-Watt P3 or similar plug-in meter gives real-time watts, cumulative kWh, and estimated monthly cost. Plug an appliance in for 7 days to get accurate average usage (most appliances cycle on/off). Fridges cycle 30-50% of the time = measured run-time × 0.4 for daily average." },
      { label: "Typical Appliance Wattage Reference", value: "Space heater: 1,500W. Hair dryer: 1,500-1,800W. Microwave: 800-1,200W. Toaster: 800-1,500W. Coffee maker: 600-1,200W. Dishwasher: 1,200-1,500W (includes heating element). Washing machine: 400-1,400W (heater dependent). Dryer: 1,800-5,000W. TV (LED 55\"): 80-150W. Laptop: 45-90W. Desktop: 200-500W. Router: 6-15W." },
      { label: "Idle / Standby Power (Vampire Load)", value: "Most electronics draw power even when 'off.' Typical standby: TV 1-3W, cable box 15-30W (biggest vampire), game console 8-15W, computer 3-10W, phone charger 0.1-0.5W. A household with typical electronics loses 50-150W continuously = 438-1,314 kWh/yr ($65-200/yr at $0.15/kWh). Use smart power strips." },
      { label: "Peak vs Average Power", value: "Many appliances have startup surge (2-5× rated wattage for 1-2 seconds). Refrigerator compressor: 600W running, 1,800W startup. AC: 3,000W running, 6,000+W startup. This matters for generator sizing and inverter selection. For energy calculations, use running watts × run time." },
      { label: "HVAC Energy Dominance", value: "Heating and cooling account for 50-60% of US home energy use. A 3-ton central AC (3,500W) running 8 hrs/day = 28 kWh/day = 840 kWh/month ($126 at $0.15/kWh). A space heater (1,500W) running 6 hrs/day = 9 kWh/day = 270 kWh/month ($40.50). Programmable thermostat savings: 10-15% on HVAC = $100-200/yr typical." },
      { label: "Phantom Load Reduction Tips", value: "Use advanced power strips ($15-30) that cut power to peripherals when main device is off. Unplug rarely-used devices. Group devices on switched strips. Smart plugs ($10-20) with schedules — turn off TV and entertainment system at midnight, on at 5 PM. Total savings: $50-150/yr." },
      { label: "Comparing Energy-Saving Upgrades", value: "Replace old fridge (1990s, 800 kWh/yr) with new Energy Star (400 kWh/yr): saves $60/yr. Swap all bulbs to LED (10W vs 60W): 50 kWh/yr per bulb × 10 bulbs = 500 kWh = $75/yr. Add attic insulation: $0.50-1/sq ft, saves 15-20% on HVAC = $100-200/yr. Heat pump water heater: $1,200-2,000 installed, saves $200-350/yr vs electric resistance." },
    ]}
  },
  description: 'Compute the monthly and annual energy consumption of any electrical appliance using its wattage rating and your specific usage pattern. Includes cost estimation at typical US electricity rates.',
  formula: 'Daily kWh = Watts × Hours / 1000 | Monthly kWh = Daily kWh × Days/Month | Est. Cost = kWh × $0.15/kWh',
  interpretation: 'Understanding individual appliance energy consumption is the first step toward reducing your electric bill. A Kill-A-Watt meter ($25) typically pays for itself in 2-3 months by identifying the biggest energy hogs in your home. The top three energy consumers in most households: HVAC (50-60%), water heating (12-18%), and refrigeration (6-8%). A single space heater running 8 hrs/day at $0.15/kWh adds $54/month — more than a 55" LED TV running 24/7.'
}

export default calcDef

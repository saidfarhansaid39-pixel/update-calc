import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentWatt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), newWatt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bulbCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), elecRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  defaults: { currentWatt: '60', newWatt: '9', hoursPerDay: '4', bulbCount: '10', elecRate: '0.12' },
  presets: [
    { label: 'LED Replacing 60W', values: { currentWatt: '60', newWatt: '9', hoursPerDay: '4', bulbCount: '10', elecRate: '0.12' } },
    { label: 'LED Replacing 100W', values: { currentWatt: '100', newWatt: '14', hoursPerDay: '6', bulbCount: '5', elecRate: '0.15' } },
    { label: 'CFL to LED', values: { currentWatt: '13', newWatt: '8', hoursPerDay: '8', bulbCount: '8', elecRate: '0.12' } },
  ],
  fields: [
    { name: 'currentWatt', label: 'Current Bulb Wattage', type: 'number', min: 1, step: '10' },
    { name: 'newWatt', label: 'New Bulb Wattage', type: 'number', min: 1, step: '5' },
    { name: 'hoursPerDay', label: 'Hours On Per Day', type: 'number', min: 0.5, step: '1' },
    { name: 'bulbCount', label: 'Number of Bulbs', type: 'number', min: 1, step: '1' },
    { name: 'elecRate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const oldW = parseFloat(v.currentWatt)||0; const newW = parseFloat(v.newWatt)||0; const hrs = parseFloat(v.hoursPerDay)||0; const cnt = parseFloat(v.bulbCount)||0; const rate = parseFloat(v.elecRate)||0
    const wattSaved = oldW - newW
    const dailyKwhSaved = (wattSaved * hrs * cnt) / 1000
    const annualKwhSaved = dailyKwhSaved * 365
    const annualSavings = annualKwhSaved * rate
    return { result: annualSavings, label: 'Annual Savings', unit: '$', steps: [
      { label: '1. Watts Saved', value: `${oldW}W - ${newW}W = ${wattSaved}W per bulb` },
      { label: '2. Daily kWh Savings', value: `(${wattSaved}W × ${hrs}h × ${cnt} bulbs) ÷ 1000 = ${dailyKwhSaved.toFixed(3)} kWh` },
      { label: '3. Annual kWh Savings', value: `${dailyKwhSaved.toFixed(3)} × 365 = ${annualKwhSaved.toFixed(0)} kWh` },
      { label: '4. Annual $ Savings', value: `${annualKwhSaved.toFixed(0)} kWh × $${rate} = $${annualSavings.toFixed(2)}` },
    ] ,
    extras: [
      { label: 'Lifespan Comparison', value: 'LEDs last 15,000-50,000 hours (10-20 years). Incandescents last 750-2,000 hours (6-12 months). CFLs: 8,000-15,000 hours (3-5 years).' },
      { label: 'Color Temperature', value: 'Warm white (2700-3000K) for living rooms and bedrooms. Cool white (3500-4100K) for kitchens. Daylight (5000-6500K) for garages and workshops.' },
      { label: 'Lumens Not Watts', value: 'Shop by lumens (brightness): 450 lm = 40W incandescent = 6-8W LED. 800 lm = 60W = 9-12W LED. 1600 lm = 100W = 14-18W LED.' },
      { label: 'Dimmer Compatibility', value: 'Not all LEDs work with dimmer switches. Look for "dimmable" on the package. Non-dimmable LEDs on a dimmer will flicker and burn out early.' },
      { label: 'Energuide Rating', value: 'Energy Star certified LEDs use 20-30% less than standard LEDs. They save 70-90% vs incandescents. Look for the blue Energy Star label.' },
      { label: 'Smart Bulbs', value: 'Smart LEDs (Philips Hue, etc.) cost $15-50 each but enable scheduling, dimming, and color changes. Typical payback: 2-3 years vs standard LED.' },
      { label: 'Recycling', value: 'LEDs contain no mercury and are recyclable. CFLs contain 4-5 mg mercury — recycle at Home Depot or Lowe\'s. Incandescents go in regular trash.' },
      { label: 'Whole House Savings', value: 'A typical US home has 40-60 light sockets. Replacing all incandescents with LEDs saves $200-400/year. Payback period on LEDs is 6-12 months.' },
    ]}
  },
  description: 'Calculate annual electricity savings from switching to more energy-efficient light bulbs. Supports incandescent, CFL, and LED comparisons with wattage, usage, and rate inputs.',
  formula: 'Annual Savings = (OldW - NewW) × Hours × Count × 365 / 1000 × Rate. Example: (60-9) × 4 × 10 × 365 / 1000 × $0.12 = $89.35/year.',
  interpretation: 'LED bulbs use 75-85% less energy than incandescents and last 15-25× longer. Replacing 10 bulbs used 4 hrs/day saves ~$89/year at $0.12/kWh. US average electricity rate: $0.12-0.16/kWh. Payback period for LED bulbs: under 6 months.'
}

export default calcDef

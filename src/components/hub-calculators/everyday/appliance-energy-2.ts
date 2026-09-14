import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ aeApplianceWattage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aeHoursDaily: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aeDaysMonthly: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aeRateKwh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aeStandbyWatts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'aeApplianceWattage', label: 'Appliance Wattage (W)', type: 'number', min: 10, step: '50' },
    { name: 'aeHoursDaily', label: 'Hours Used per Day', type: 'number', min: 0.1, step: '0.5' },
    { name: 'aeDaysMonthly', label: 'Days Used per Month', type: 'number', min: 1, max: 31, step: '1' },
    { name: 'aeRateKwh', label: 'Electric Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'aeStandbyWatts', label: 'Standby Power (W)', type: 'number', min: 0, step: '1' },
  ],
  defaults: { aeApplianceWattage: '150', aeHoursDaily: '8', aeDaysMonthly: '30', aeRateKwh: '0.14', aeStandbyWatts: '5' },
  presets: [
    { label: 'TV (100W active, 5W standby)', values: { aeApplianceWattage: '100', aeHoursDaily: '5', aeDaysMonthly: '30', aeRateKwh: '0.14', aeStandbyWatts: '5' } },
    { label: 'Gaming PC (400W, 10W idle)', values: { aeApplianceWattage: '400', aeHoursDaily: '4', aeDaysMonthly: '25', aeRateKwh: '0.14', aeStandbyWatts: '10' } },
    { label: 'Desktop PC (200W, 3W standby)', values: { aeApplianceWattage: '200', aeHoursDaily: '8', aeDaysMonthly: '30', aeRateKwh: '0.14', aeStandbyWatts: '3' } },
    { label: 'Microwave (1000W, 2W standby)', values: { aeApplianceWattage: '1000', aeHoursDaily: '0.5', aeDaysMonthly: '30', aeRateKwh: '0.14', aeStandbyWatts: '2' } },
  ],
  compute: (v) => {
    const activeKwh = v.aeApplianceWattage * v.aeHoursDaily * v.aeDaysMonthly / 1000
    const standbyKwh = v.aeStandbyWatts * 24 * v.aeDaysMonthly / 1000
    const totalKwh = activeKwh + standbyKwh
    const activeCost = activeKwh * v.aeRateKwh
    const standbyCost = standbyKwh * v.aeRateKwh
    const totalCost = totalKwh * v.aeRateKwh
    const standbyPct = totalKwh > 0 ? (standbyKwh / totalKwh) * 100 : 0
    const annualStandbyCost = standbyCost * 12
    return { result: totalCost, label: 'Monthly Energy Cost', unit: '$', steps: [
      { label: '1. Active energy', value: `${v.aeApplianceWattage} W × ${v.aeHoursDaily} hrs × ${v.aeDaysMonthly} days ÷ 1000 = ${activeKwh.toFixed(1)} kWh` },
      { label: '2. Standby energy', value: `${v.aeStandbyWatts} W × 24 hrs × ${v.aeDaysMonthly} days ÷ 1000 = ${standbyKwh.toFixed(1)} kWh` },
      { label: '3. Total consumption', value: `${activeKwh.toFixed(1)} + ${standbyKwh.toFixed(1)} = ${totalKwh.toFixed(1)} kWh` },
      { label: '4. Standby percentage', value: `${standbyKwh.toFixed(1)} ÷ ${totalKwh.toFixed(1)} = ${standbyPct.toFixed(1)}% of total` },
      { label: '5. Active cost', value: `${activeKwh.toFixed(1)} kWh × $${v.aeRateKwh} = $${activeCost.toFixed(2)}` },
      { label: '6. Standby cost', value: `${standbyKwh.toFixed(1)} kWh × $${v.aeRateKwh} = $${standbyCost.toFixed(2)}` },
      { label: '7. Total monthly cost', value: `$${activeCost.toFixed(2)} + $${standbyCost.toFixed(2)} = $${totalCost.toFixed(2)}` },
      { label: '8. Annual standby waste', value: `$${standbyCost.toFixed(2)} × 12 = $${annualStandbyCost.toFixed(2)}/yr` },
    ] ,
    extras: [
      { label: "Phantom Load Prevention", value: "Use smart power strips that automatically cut power to peripherals when the main device is off. Saves $50-100/year on standby waste." },
      { label: "Common Standby Draws", value: "TV 5-15W, game console 8-15W, cable box 15-30W, laptop charger 2-5W, desktop PC 3-10W, microwave clock 2-4W. Add up to 10% of your bill." },
      { label: "Annual Standby Cost", value: "The average US home wastes $100-200/year on standby power. That's 5-10% of your total electricity bill for devices doing nothing." },
      { label: "Unplug Strategy", value: "Unplug devices you use infrequently — spare TVs, guest room electronics, seasonal appliances. Easy access = higher chance you'll do it." },
      { label: "Advanced Power Strips", value: "Timer strips cut power at set times. Master-slave strips turn off accessories when the main device is off. Both cost $15-35 and pay back in 6-12 months." },
      { label: "Energy Monitor", value: "Use a Kill-A-Watt meter ($20-30) to measure actual active + standby draw. Many devices draw more than their listed standby rating." },
      { label: "Smart Home Integration", value: "Smart plugs ($10-20) let you schedule and remotely control power. Set TVs and gaming consoles to auto-off during work/sleep hours." },
      { label: "ENERGY STAR Most Efficient", value: "Look for ENERGY STAR Most Efficient certification — these products have the lowest standby power consumption, often <1W in off mode." },
    ]}
  },
  description: 'Calculate monthly energy usage and cost for any appliance including standby power consumption. Shows standby percentage and annual phantom load waste.',
  formula: 'Active kWh = (W × hrs × days) ÷ 1000 | Standby kWh = (W × 24 × days) ÷ 1000 | Total Cost = Total kWh × Rate',
  interpretation: 'Standby power accounts for 5-10% of home electricity use ($100-200/yr). Common phantom loads: TV 5W, cable box 20W, game console 10W. Smart power strips eliminate 80%+ of standby waste.'
}

export default calcDef

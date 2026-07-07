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
  compute: (v) => {
    const activeKwh = v.aeApplianceWattage * v.aeHoursDaily * v.aeDaysMonthly / 1000
    const standbyKwh = v.aeStandbyWatts * 24 * v.aeDaysMonthly / 1000
    const totalKwh = activeKwh + standbyKwh
    const activeCost = activeKwh * v.aeRateKwh
    const standbyCost = standbyKwh * v.aeRateKwh
    const totalCost = totalKwh * v.aeRateKwh
    return { result: totalCost, label: 'Monthly Energy Cost', unit: '$', steps: [{ label: 'Active Usage', value: `${activeKwh.toFixed(1)} kWh` }, { label: 'Standby Usage', value: `${standbyKwh.toFixed(1)} kWh` }, { label: 'Total kWh', value: `${totalKwh.toFixed(1)} kWh` }, { label: 'Active Cost', value: `$${activeCost.toFixed(2)}` }, { label: 'Standby Cost', value: `$${standbyCost.toFixed(2)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }] }
  },
  description: 'Calculate monthly energy usage and cost for any appliance including standby power consumption. Many electronics draw power even when turned off.',
  formula: 'kWh = (Wattage × Hours × Days / 1000) + (Standby × 24 × Days / 1000) | Cost = kWh × Rate',
  interpretation: 'Standby power accounts for 5-10% of home electricity use. Common standby loads: TV 5W, laptop charger 3W, game console 10W. Use smart power strips to eliminate phantom loads.'
}

export default calcDef

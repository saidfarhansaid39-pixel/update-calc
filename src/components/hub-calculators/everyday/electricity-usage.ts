import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ applianceWatts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysPerMonth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'applianceWatts', label: 'Appliance Wattage (W)', type: 'number', min: 1, step: '10' },
    { name: 'hoursPerDay', label: 'Hours Used per Day', type: 'number', min: 0.1, step: '0.5' },
    { name: 'daysPerMonth', label: 'Days Used per Month', type: 'number', min: 1, max: 31, step: '1' },
  ],
  compute: (v) => {
    const dailyKwh = v.applianceWatts * v.hoursPerDay / 1000
    const monthlyKwh = dailyKwh * v.daysPerMonth
    return { result: monthlyKwh, label: 'Monthly Energy Usage', unit: 'kWh', steps: [{ label: 'Daily Usage', value: `${dailyKwh.toFixed(3)} kWh` }, { label: 'Monthly Usage', value: `${monthlyKwh.toFixed(1)} kWh` }] }
  },
  description: 'Calculate the monthly energy consumption of any electrical appliance in kWh from its wattage and usage pattern.',
  formula: 'kWh/Month = (Watts × Hours/Day × Days/Month) / 1000',
  interpretation: 'Common appliance usage: fridge ~150W (continuous), AC ~3500W (cycling), TV ~100W, laptop ~50W. Use a Kill-A-Watt meter for accurate individual appliance tracking.'
}

export default calcDef

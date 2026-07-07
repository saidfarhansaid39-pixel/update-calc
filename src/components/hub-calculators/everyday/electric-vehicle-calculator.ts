import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ batteryKwh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rangeMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), chargeRateKw: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dailyMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'batteryKwh', label: 'Battery Capacity (kWh)', type: 'number', min: 10, step: '5' },
    { name: 'rangeMiles', label: 'Full Range (miles)', type: 'number', min: 50, step: '10' },
    { name: 'chargeRateKw', label: 'Charger Power (kW)', type: 'number', min: 1, step: '1' },
    { name: 'dailyMiles', label: 'Daily Driving (miles)', type: 'number', min: 1, step: '5' },
  ],
  compute: (v) => {
    const efficiency = v.batteryKwh / v.rangeMiles
    const dailyKwhNeeded = v.dailyMiles * efficiency
    const chargeTimeHrs = dailyKwhNeeded / v.chargeRateKw
    const chargeTimeMin = chargeTimeHrs * 60
    const pctUsed = (v.dailyMiles / v.rangeMiles) * 100
    return { result: chargeTimeMin, label: 'Charge Time Needed', unit: 'min', steps: [{ label: 'Efficiency', value: `${efficiency.toFixed(2)} kWh/mi` }, { label: 'Daily Energy Needed', value: `${dailyKwhNeeded.toFixed(1)} kWh` }, { label: 'Charge Time', value: `${chargeTimeMin.toFixed(0)} min` }, { label: 'Battery Used', value: `${pctUsed.toFixed(0)}%` }] }
  },
  description: 'Calculate electric vehicle charging time needed for your daily commute based on battery capacity, range, charger power, and driving distance.',
  formula: 'Charge Time = (Daily Miles × Battery kWh / Range) / Charger kW',
  interpretation: 'Level 1 (120V ~1.2 kW) adds 3-5 mi/hr. Level 2 (240V ~7.2 kW) adds 20-30 mi/hr. DC Fast Charge (50-350 kW) adds 150-1000 mi/hr. Most EV owners charge overnight on Level 2.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ batteryCapacity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), deviceWattage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), efficiency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'batteryCapacity', label: 'Battery Capacity (mAh)', type: 'number', min: 100, step: '100' },
    { name: 'deviceWattage', label: 'Device Power Draw (W)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'efficiency', label: 'Efficiency Loss (%)', type: 'number', min: 0, max: 50, step: '5' },
  ],
  compute: (v) => {
    const batteryWh = (v.batteryCapacity / 1000) * 3.7
    const usableWh = batteryWh * (1 - v.efficiency / 100)
    const hours = usableWh / v.deviceWattage
    return { result: hours, label: 'Battery Life', unit: 'hours', steps: [{ label: 'Battery Energy', value: `${batteryWh.toFixed(1)} Wh` }, { label: 'Usable Energy', value: `${usableWh.toFixed(1)} Wh` }, { label: 'Estimated Life', value: `${hours.toFixed(1)} hrs` }] }
  },
  description: 'Estimate battery runtime for any device based on battery capacity (mAh), power draw (watts), and system efficiency losses.',
  formula: 'Hours = ((mAh/1000)×3.7×(1-Efficiency/100)) / Watts',
  interpretation: 'Lithium-ion cells have ~3.7V nominal. Real-world runtime is 70-85% of theoretical due to conversion losses, heat, and battery age. Depth of discharge affects cycle life.'
}

export default calcDef

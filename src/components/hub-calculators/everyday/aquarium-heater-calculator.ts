import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ahTankVolume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ahDesiredTemp: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ahRoomTemp: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ahUnitChoice: z.string().min(1) }),
  fields: [
    { name: 'ahTankVolume', label: 'Tank Volume (gallons)', type: 'number', min: 1, step: '5' },
    { name: 'ahDesiredTemp', label: 'Desired Water Temp (°F)', type: 'number', min: 65, max: 86, step: '1' },
    { name: 'ahRoomTemp', label: 'Room Temperature (°F)', type: 'number', min: 55, max: 95, step: '1' },
    { name: 'ahUnitChoice', label: 'Temperature Unit', type: 'select', options: [{ label: 'Fahrenheit', value: 'f' }, { label: 'Celsius', value: 'c' }] },
  ],
  compute: (v) => {
    const tempDiff = v.ahDesiredTemp - v.ahRoomTemp
    const recommendedWatts = tempDiff > 0 ? Math.ceil(v.ahTankVolume * 5 * (tempDiff / 10)) : 0
    const minWatts = Math.max(25, recommendedWatts)
    const maxSafeWatts = v.ahTankVolume * 5
    const btuh = recommendedWatts * 3.412
    const annualKwh = recommendedWatts * 8 * 365 / 1000
    return { result: recommendedWatts, label: 'Recommended Heater Wattage', unit: 'W', steps: [{ label: 'Temp Differential', value: `${tempDiff.toFixed(1)}°F` }, { label: 'Rule of Thumb', value: `${v.ahTankVolume} gal × 5 W/gal = ${maxSafeWatts} W max` }, { label: 'Recommended', value: `${recommendedWatts} W` }, { label: 'Heat Output', value: `${btuh.toFixed(0)} BTU/hr` }, { label: 'Annual Energy', value: `${annualKwh.toFixed(0)} kWh` }] }
  },
  description: 'Determine the correct aquarium heater wattage based on tank volume, desired water temperature, and room temperature. Keep tropical fish at 76-82°F.',
  formula: 'Watts = Gallons × 5 × (Desired - Room) / 10 | BTU/hr = Watts × 3.412 | Max Safe = Gallons × 5',
  interpretation: 'Rule of thumb: 5W per gallon for tropical tanks, 3W per gallon for cold water. Two smaller heaters are safer than one large one. Always use a controller with heaters above 200W. Position near water flow for even heating.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    speedKmh: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vo2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'speedKmh', label: 'Running Speed', type: 'number', unit: 'km/h', min: 5, step: '0.5' },
    { name: 'vo2', label: 'Measured VO2', type: 'number', unit: 'mL/kg/min', min: 10, step: '0.1' },
  ],
  compute: (v) => {
    const speedMmin = v.speedKmh * 1000 / 60
    const economy = v.vo2 / speedMmin
    const typical = 210
    const efficiency = economy < typical ? 'Better than average' : economy > typical + 20 ? 'Below average' : 'Average'
    return {
      result: economy, label: 'Running Economy', unit: 'mL/kg/km',
      steps: [
        { label: 'Speed', value: `${v.speedKmh} km/h (${speedMmin.toFixed(0)} m/min)` },
        { label: 'VO2 at this speed', value: `${v.vo2} mL/kg/min` },
        { label: 'Running economy', value: `${economy.toFixed(1)} mL/kg/km` },
        { label: 'Typical reference', value: `~210 mL/kg/km for trained runners` },
        { label: 'Efficiency', value: efficiency },
      ]
}
  },
  description: 'Calculate running economy (oxygen cost per kilometer at a given speed). Better running economy means using less oxygen to maintain the same pace, indicating more efficient running form.'
}

export default calcDef

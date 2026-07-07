import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    chainring: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 20 && val <= 60 }, '20-60'),
    cog: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 10 && val <= 50 }, '10-50'),
    wheelCirc: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 1 && val <= 3 }, '1-3 m')
}),
  fields: [
    { name: 'chainring', label: 'Chainring Teeth', type: 'number', min: 20, max: 60, step: '1' },
    { name: 'cog', label: 'Rear Cog Teeth', type: 'number', min: 10, max: 50, step: '1' },
    { name: 'wheelCirc', label: 'Wheel Circumference', type: 'number', unit: 'm', min: 1, max: 3, step: '0.01' },
  ],
  compute: (v) => {
    const gearRatio = v.chainring / v.cog
    const developM = gearRatio * v.wheelCirc
    const speed90 = developM * 90 * 60 / 1000
    return {
      result: developM, label: 'Meters of Development', unit: 'm',
      steps: [
        { label: 'Gear ratio', value: `${v.chainring}/${v.cog} = ${gearRatio.toFixed(2)}` },
        { label: 'Wheel circumference', value: `${v.wheelCirc} m` },
        { label: 'Development', value: `${developM.toFixed(2)} m per pedal revolution` },
        { label: 'Speed at 90 RPM', value: `${speed90.toFixed(1)} km/h` },
      ]
}
  },
  description: 'Calculate meters of development — the distance traveled per pedal revolution. This gear measurement helps cyclists understand the real-world effect of their gear choices.'
}

export default calcDef

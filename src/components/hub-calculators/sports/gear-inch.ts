import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    chainring: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 20 && val <= 60 }, '20-60'),
    cog: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 10 && val <= 50 }, '10-50'),
    wheelInch: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 20 && val <= 30 }, '20-30')
}),
  fields: [
    { name: 'chainring', label: 'Chainring Teeth', type: 'number', min: 20, max: 60, step: '1' },
    { name: 'cog', label: 'Rear Cog Teeth', type: 'number', min: 10, max: 50, step: '1' },
    { name: 'wheelInch', label: 'Wheel Diameter', type: 'number', unit: 'inches', min: 20, max: 30, step: '0.5' },
  ],
  compute: (v) => {
    const gearRatio = v.chainring / v.cog
    const gearInches = gearRatio * v.wheelInch
    const developM = gearInches * 0.0254 * Math.PI
    return {
      result: gearInches, label: 'Gear Inches', unit: 'in',
      steps: [
        { label: 'Gear ratio', value: `${v.chainring}/${v.cog} = ${gearRatio.toFixed(2)}` },
        { label: 'Wheel diameter', value: `${v.wheelInch} in` },
        { label: 'Gear inches', value: `${gearInches.toFixed(1)} in` },
        { label: 'Meters per revolution', value: `${developM.toFixed(2)} m/rev` },
        { label: 'Classification', value: gearInches < 60 ? 'Low (climbing)' : gearInches < 80 ? 'Medium (rolling)' : 'High (descending)' },
      ]
}
  },
  description: 'Calculate gear inches for your bicycle drivetrain. Gear inches represent the effective wheel diameter and help cyclists compare gear ratios across different wheel sizes.'
}

export default calcDef

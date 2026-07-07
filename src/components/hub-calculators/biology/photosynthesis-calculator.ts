import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    light: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    co2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    temp: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 50 }, '0-50')
}),
  fields: [
    { name: 'light', label: 'Light Intensity (PAR)', type: 'number', unit: 'µmol·m?²·s?¹', min: 1, step: '1' },
    { name: 'co2', label: 'CO2 Concentration', type: 'number', unit: 'ppm', min: 50, step: '1' },
    { name: 'temp', label: 'Temperature', type: 'number', unit: '°C', min: 0, max: 50, step: '0.1' },
  ],
  compute: (v) => {
    const lightFactor = v.light / (v.light + 200)
    const co2Factor = v.co2 / (v.co2 + 300)
    const tempOpt = Math.exp(-0.5 * ((v.temp - 25) / 8) ** 2)
    const rate = 60 * lightFactor * co2Factor * tempOpt
    return {
      result: rate, label: 'Photosynthesis Rate', unit: 'µmol·m?²·s?¹',
      steps: [
        { label: 'Light factor', value: `${lightFactor.toFixed(3)}` },
        { label: 'CO2 factor', value: `${co2Factor.toFixed(3)}` },
        { label: 'Temperature factor', value: `${tempOpt.toFixed(3)}` },
        { label: 'Est. photosynthetic rate', value: `${rate.toFixed(2)} µmol·m?²·s?¹` },
      ]
}
  },
  description: 'Photosynthesis rate depends on light intensity, CO2 concentration, and temperature. Each factor can be limiting. This model uses a multiplicative Michaelis-Menten approach.',
  formula: 'Rate = Pmax × (I/(I+K_I)) × ([CO2]/([CO2]+K_C)) × exp(-0.5×((T-Topt)/s)²)',
  interpretation: 'Light saturation: ~500-1000 µmol·m?²·s?¹. CO2 saturation: ~800-1200 ppm. Temperature optimum: 25-30°C for C3 plants.'
}

export default calcDef

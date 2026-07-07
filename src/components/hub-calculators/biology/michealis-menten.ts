import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    substrate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    vmax: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    km: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'substrate', label: 'Substrate Concentration [S]', type: 'number', unit: 'mM', min: 0.001, step: '0.001' },
    { name: 'vmax', label: 'Maximum Velocity (Vmax)', type: 'number', unit: 'µM/min', min: 0.1, step: '0.1' },
    { name: 'km', label: 'Michaelis Constant (Km)', type: 'number', unit: 'mM', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const velocity = (v.vmax * v.substrate) / (v.km + v.substrate)
    const satPct = (v.substrate / (v.km + v.substrate)) * 100
    return {
      result: velocity, label: 'Reaction Velocity (v)', unit: 'µM/min',
      steps: [
        { label: '[S]', value: `${v.substrate} mM` },
        { label: 'Vmax', value: `${v.vmax} µM/min` },
        { label: 'Km', value: `${v.km} mM` },
        { label: 'v = Vmax × [S] / (Km + [S])', value: `${velocity.toFixed(4)} µM/min` },
        { label: 'Saturation level', value: `${satPct.toFixed(1)}% of Vmax` },
        { label: 'At [S] = Km, v = ½ Vmax', value: `${(v.vmax / 2).toFixed(2)} µM/min` },
      ]
}
  },
  description: 'The Michaelis-Menten equation describes enzyme kinetics: reaction velocity as a function of substrate concentration. Km reflects substrate affinity, Vmax reflects catalytic capacity.',
  formula: 'v = Vmax × [S] / (Km + [S]) | Km = [S] at ½ Vmax | kcat = Vmax / [E]total | Specificity = kcat/Km',
  interpretation: 'Low Km = high affinity (reaches ½ Vmax at low [S]). High Vmax = fast catalysis. kcat/Km (specificity constant) best measures enzyme efficiency. At [S] >> Km, velocity ˜ Vmax (zero-order kinetics).'
}

export default calcDef

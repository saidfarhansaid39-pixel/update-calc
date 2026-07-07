import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    kc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    deltaN: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= -5 && n <= 5 }, '-5 to 5'),
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'kc', label: 'Kc (Equilibrium Constant)', type: 'number', unit: '', min: 1e-20, step: 'any' },
    { name: 'deltaN', label: 'Δn (gas moles change)', type: 'number', unit: '', min: -5, max: 5, step: '1' },
    { name: 'temp', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 0.082057
    const Kp = v.kc * Math.pow(R * v.temp, v.deltaN)
    return {
      result: Kp, label: 'Equilibrium Constant Kp', unit: '',
      steps: [
        { label: 'Kc', value: `${v.kc.toExponential(4)}` },
        { label: 'Δn', value: `${v.deltaN >= 0 ? '+' : ''}${v.deltaN}` },
        { label: 'T', value: `${v.temp} K` },
        { label: '(RT)^Δn', value: `${Math.pow(R * v.temp, v.deltaN).toExponential(4)}` },
        { label: 'Kp = Kc(RT)^Δn', value: Kp.toExponential(4) },
      ]
}
  },
  description: 'Kp is the equilibrium constant in terms of partial pressures for gas-phase reactions. Kp = Kc(RT)^Δn where Δn is the change in moles of gas.',
  formula: 'Kp = Kc(RT)^Δn',
  interpretation: 'When Δn = 0, Kp = Kc. When Δn > 0 (more gas molecules produced), Kp > Kc. When Δn < 0 (fewer gas molecules), Kp < Kc.'
}

export default calcDef

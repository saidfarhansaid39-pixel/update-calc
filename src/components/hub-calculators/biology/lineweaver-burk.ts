import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    vmax: z.string().refine(v => parseFloat(v) > 0, '>0'),
    km: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'vmax', label: 'Vmax (µM/min)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'km', label: 'Km (µM)', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const interceptX = -1 / v.km; const interceptY = 1 / v.vmax
    return {
      result: interceptY, label: '1/Vmax (Y-intercept)', unit: 'min/µM',
      steps: [
        { label: 'Vmax', value: `${v.vmax} µM/min` },
        { label: 'Km', value: `${v.km} µM` },
        { label: 'Y-intercept = 1/Vmax', value: `${interceptY.toExponential(4)}` },
        { label: 'X-intercept = -1/Km', value: `${interceptX.toExponential(4)}` },
        { label: 'Slope = Km/Vmax', value: `${(v.km / v.vmax).toExponential(4)}` },
      ]
}
  },
  description: 'The Lineweaver-Burk (double reciprocal) plot linearizes the Michaelis-Menten equation for determining enzyme kinetics parameters Vmax and Km.',
  formula: '1/v = (Km/Vmax) × 1/[S] + 1/Vmax | X-intercept = -1/Km | Y-intercept = 1/Vmax',
  interpretation: 'Km reflects substrate affinity (lower Km = higher affinity). Vmax reflects catalytic capacity. Lineweaver-Burk plots can reveal competitive, non-competitive, and uncompetitive inhibition patterns.'
}

export default calcDef

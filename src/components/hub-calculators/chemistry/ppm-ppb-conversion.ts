import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    value: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    fromUnit: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'value', label: 'Concentration Value', type: 'number', unit: '', min: 0, step: '0.01' },
    { name: 'fromUnit', label: 'From Unit', type: 'select', options: [
      { label: 'ppm (parts per million)', value: 'ppm' },
      { label: 'ppb (parts per billion)', value: 'ppb' },
      { label: 'ppt (parts per trillion)', value: 'ppt' },
      { label: '% (percent)', value: 'percent' },
      { label: 'mg/L', value: 'mgL' },
    ] },
  ],
  compute: (v) => {
    const factor: Record<string, number> = { 'ppm': 1, 'ppb': 0.001, 'ppt': 0.000001, 'percent': 10000, 'mgL': 1 }
    const ppm = v.value * factor[v.fromUnit]
    return {
      result: ppm, label: 'Concentration in ppm', unit: 'ppm',
      steps: [
        { label: 'Input', value: `${v.value} ${v.fromUnit}` },
        { label: 'ppm', value: `${ppm.toFixed(4)} ppm` },
        { label: 'ppb', value: `${(ppm * 1000).toFixed(4)} ppb` },
        { label: 'ppt', value: `${(ppm * 1000000).toFixed(4)} ppt` },
        { label: '%', value: `${(ppm / 10000).toExponential(4)}%` },
        { label: 'mg/L', value: `${ppm} mg/L (for dilute aq. solutions)` },
      ]
}
  },
  description: 'Convert between parts per million (ppm), parts per billion (ppb), parts per trillion (ppt), percent, and mg/L. For dilute aqueous solutions, 1 ppm ≈ 1 mg/L.',
  formula: '1% = 10,000 ppm | 1 ppm = 1000 ppb | 1 ppb = 1000 ppt',
  interpretation: 'EPA limits: lead in drinking water = 15 ppb, arsenic = 10 ppb. 1 ppm = 1 mg per kg = 1 μL per L of water. ppm measures trace-level concentrations.'
}

export default calcDef

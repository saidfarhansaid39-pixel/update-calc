import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    density: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'density', label: 'Density of Substance', type: 'number', unit: 'g/mL', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const sg = v.density / 1.000
    return {
      result: sg, label: 'Specific Gravity', unit: '',
      steps: [
        { label: 'Density of substance', value: `${v.density} g/mL` },
        { label: 'Density of water (reference)', value: '1.000 g/mL' },
        { label: 'SG = ρ(substance) / ρ(water)', value: sg.toFixed(4) },
        { label: 'Floats?', value: sg <= 1 ? 'Yes (less dense than water)' : 'No (denser than water)' },
      ]
}
  },
  description: 'Specific gravity is the ratio of a substance\'s density to the density of water. It is dimensionless and temperature-dependent.',
  formula: 'SG = ρ(substance) / ρ(water)',
  interpretation: 'SG < 1: less dense than water (floats). SG > 1: denser than water (sinks). SG = 1: same density as water. Specific gravity is commonly measured with hydrometers.'
}

export default calcDef

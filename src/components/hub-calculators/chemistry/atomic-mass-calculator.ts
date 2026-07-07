import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    abund1: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 100 }, '0-100'),
    mass2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    abund2: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 100 }, '0-100')
}),
  fields: [
    { name: 'mass1', label: 'Isotope 1 Mass', type: 'number', unit: 'u', min: 1, step: '0.001' },
    { name: 'abund1', label: 'Isotope 1 Abundance', type: 'number', unit: '%', min: 0.1, max: 100, step: '0.1' },
    { name: 'mass2', label: 'Isotope 2 Mass', type: 'number', unit: 'u', min: 1, step: '0.001' },
    { name: 'abund2', label: 'Isotope 2 Abundance', type: 'number', unit: '%', min: 0.1, max: 100, step: '0.1' },
  ],
  compute: (v) => {
    const avg = (v.mass1 * v.abund1 / 100 + v.mass2 * v.abund2 / 100) / ((v.abund1 + v.abund2) / 100)
    return {
      result: avg, label: 'Average Atomic Mass', unit: 'u',
      steps: [
        { label: 'Isotope 1', value: `${v.mass1} u × ${v.abund1}%` },
        { label: 'Isotope 2', value: `${v.mass2} u × ${v.abund2}%` },
        { label: 'Weighted average', value: `${avg.toFixed(3)} u` },
      ]
}
  },
  description: 'Average atomic mass is the weighted average of the masses of an element\'s isotopes, calculated using their natural abundances.',
  formula: 'Average mass = Σ(massᵢ × abundanceᵢ) / Σ(abundanceᵢ)',
  interpretation: 'The calculated value represents the average atomic mass of the element as it appears on the periodic table. Most elements have 2-10 naturally occurring isotopes.'
}

export default calcDef

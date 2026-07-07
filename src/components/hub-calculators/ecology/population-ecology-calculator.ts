import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    initial: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    birthRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    deathRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    immig: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    emig: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'initial', label: 'Initial Population', type: 'number', min: 1, step: '1' },
    { name: 'birthRate', label: 'Birth Rate (per 1000/yr)', type: 'number', min: 0, step: '0.1' },
    { name: 'deathRate', label: 'Death Rate (per 1000/yr)', type: 'number', min: 0, step: '0.1' },
    { name: 'immig', label: 'Immigration (per 1000/yr)', type: 'number', min: 0, step: '0.1' },
    { name: 'emig', label: 'Emigration (per 1000/yr)', type: 'number', min: 0, step: '0.1' },
    { name: 'years', label: 'Time Period', type: 'number', unit: 'years', min: 1, step: '1' },
  ],
  compute: (v) => {
    const r = (v.birthRate - v.deathRate + (v.immig || 0) - (v.emig || 0)) / 1000
    const final = v.initial * Math.exp(r * v.years)
    const doubling = r > 0 ? Math.LN2 / r : Infinity
    return {
      result: final, label: 'Final Population', unit: 'individuals',
      steps: [
        { label: 'Initial pop', value: `${v.initial}` },
        { label: 'Birth rate', value: `${v.birthRate}/1000` },
        { label: 'Death rate', value: `${v.deathRate}/1000` },
        { label: 'Natural increase', value: `${(v.birthRate - v.deathRate).toFixed(1)}/1000` },
        { label: 'Net migration', value: `${((v.immig || 0) - (v.emig || 0)).toFixed(1)}/1000` },
        { label: 'Growth rate r', value: `${(r * 100).toFixed(2)}%/yr` },
        { label: 'Doubling time', value: doubling === Infinity ? 'N/A (declining)' : `${doubling.toFixed(1)} yr` },
        { label: 'Final pop (t={v.years})', value: `${final.toFixed(0)}` },
      ]
}
  },
  description: 'Population ecology models demographic change from births, deaths, and migration. The growth rate r = (births - deaths + immigration - emigration) / population.',
  formula: 'r = (B - D + I - E) / N₀ | N(t) = N₀ × e^(rt) | Doubling = ln(2)/r',
  interpretation: 'r > 0 = growing, r < 0 = declining, r = 0 = stable. Human global r ≈ 1.1%/yr (doubling ~63 yr). Many species have r < 0 due to habitat loss.'
}

export default calcDef

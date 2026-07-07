import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n0: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    rate: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n < 0 && n > -1 }, '-1 to 0'),
    years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'n0', label: 'Current Population', type: 'number', min: 1, step: '1' },
    { name: 'rate', label: 'Decline Rate (r, negative)', type: 'number', min: -0.99, max: 0, step: '0.01' },
    { name: 'years', label: 'Time Horizon', type: 'number', unit: 'years', min: 1, step: '1' },
  ],
  compute: (v) => {
    const nFinal = v.n0 * Math.exp(v.rate * v.years)
    const yearsTo5 = Math.log(5 / v.n0) / v.rate
    const halflife = Math.LN2 / Math.abs(v.rate)
    return {
      result: Math.max(0, nFinal), label: 'Projected Population', unit: '',
      steps: [
        { label: 'Current N', value: `${v.n0}` },
        { label: 'Decline rate', value: `${(Math.abs(v.rate) * 100).toFixed(1)}%/yr` },
        { label: 'Population halving time', value: `${halflife.toFixed(1)} yr` },
        { label: 'After {v.years} yr', value: `${Math.max(0, nFinal).toFixed(0)}` },
        { label: 'Years to N<5', value: yearsTo5 > 0 && isFinite(yearsTo5) ? `${yearsTo5.toFixed(0)} yr` : 'Not in this century' },
        { label: 'IUCN risk category', value: Math.abs(v.rate) > 0.05 ? 'Critically Endangered' : Math.abs(v.rate) > 0.01 ? 'Endangered' : 'Vulnerable/Stable' },
      ]
}
  },
  description: 'Extinction risk assessment projects population decline under current threats. IUCN categories (Critically Endangered, Endangered, Vulnerable) guide conservation priorities.',
  formula: 'N(t) = N₀ × e^(rt) | Halving time = ln(2)/|r| | Years to extinction based on threshold',
  interpretation: 'Critically Endangered: >50% decline in 10 yr. Endangered: >30% decline. Vulnerable: >20% decline. IUCN criteria also include population size and geographic range.'
}

export default calcDef

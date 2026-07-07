import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    c14Percent: z.string().min(1, 'Required').refine(v => { const p = parseFloat(v); return p > 0 && p <= 100 }, '0 < % ≤ 100')
}),
  fields: [
    { name: 'c14Percent', label: 'Remaining ¹⁴C (%)', type: 'number', unit: '%', min: 0.001, max: 100, step: '0.1' },
  ],
  compute: (v) => {
    const tHalf = 5730
    const fraction = v.c14Percent / 100
    const k = Math.LN2 / tHalf
    const t = -Math.log(fraction) / k
    const numHalfLives = t / tHalf
    return {
      result: t, label: 'Estimated Age', unit: 'years',
      steps: [
        { label: '¹⁴C remaining', value: `${v.c14Percent}%` },
        { label: 'Fraction (N/N₀)', value: `${fraction.toFixed(4)}` },
        { label: 't₁/₂ (¹⁴C)', value: `${tHalf} years` },
        { label: 'Decay constant k', value: `${k.toExponential(4)} yr⁻¹` },
        { label: 't = -ln(N/N₀)/k', value: `${t.toFixed(0)} years` },
        { label: 'Half-lives elapsed', value: `${numHalfLives.toFixed(2)}` },
        { label: 'Dating limit', value: t > 60000 ? 'Exceeds ¹⁴C dating limit (>60,000 yr)' : 'Within ¹⁴C dating range' },
      ]
}
  },
  description: 'Carbon-14 dating determines the age of organic artifacts by measuring the remaining ¹⁴C content. ¹⁴C is produced in the upper atmosphere by cosmic rays and incorporated into living organisms via CO₂.',
  formula: 't = -ln(N/N₀) × t₁/₂ / ln(2) | t₁/₂(¹⁴C) = 5,730 years | N/N₀ = fraction of ¹⁴C remaining',
  interpretation: 'Dating range: ~500 to ~60,000 years. Samples >60,000 yr have too little ¹⁴C to measure. Calibration curves correct for atmospheric ¹⁴C variation. Shroud of Turin dated to 1260-1390 AD. Dead Sea Scrolls dated to 250 BC - 70 AD.'
}

export default calcDef

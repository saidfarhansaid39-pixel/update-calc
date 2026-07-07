import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    initial: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    remaining: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'initial', label: 'Initial Amount (N₀)', type: 'number', unit: 'atoms', min: 1, step: '1' },
    { name: 'remaining', label: 'Remaining Amount (N)', type: 'number', unit: 'atoms', min: 0.001, step: '1' },
    { name: 'time', label: 'Time Elapsed (t)', type: 'number', unit: 'years', min: 0.001, step: '1' },
  ],
  compute: (v) => {
    const k = Math.log(v.initial / v.remaining) / v.time
    const tHalf = Math.LN2 / k
    const fraction = v.remaining / v.initial
    const numHalfLives = v.time / tHalf
    return {
      result: tHalf, label: 'Half-Life (t₁/₂)', unit: 'years',
      steps: [
        { label: 'N₀ (initial)', value: `${v.initial}` },
        { label: 'N (remaining)', value: `${v.remaining}` },
        { label: 't (elapsed)', value: `${v.time} years` },
        { label: 'Fraction remaining', value: `${(fraction * 100).toFixed(2)}%` },
        { label: 'k = ln(N₀/N)/t', value: `${k.toExponential(4)} yr⁻¹` },
        { label: 't₁/₂ = ln(2)/k', value: `${tHalf.toExponential(4)} years` },
        { label: 'Half-lives elapsed', value: `${numHalfLives.toFixed(2)}` },
      ]
}
  },
  description: 'Radioactive decay follows first-order kinetics: N = N₀e⁻ᵏᵗ. The half-life (t₁/₂) is the time required for half of the radioactive nuclei to decay. t₁/₂ = ln(2)/k.',
  formula: 'N = N₀e⁻ᵏᵗ | t₁/₂ = ln(2)/k = 0.693/k | k = ln(N₀/N)/t',
  interpretation: 'C-14: 5,730 years. U-238: 4.47 billion years. I-131: 8 days (medical). Tc-99m: 6 hours (medical imaging). After 10 half-lives, <0.1% remains. After ~20 half-lives, effectively undetectable.'
}

export default calcDef

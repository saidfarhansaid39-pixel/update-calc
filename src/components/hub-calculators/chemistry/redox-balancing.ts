import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    oxChange: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1 && parseInt(v) <= 8, '1-8'),
    redChange: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1 && parseInt(v) <= 8, '1-8')
}),
  fields: [
    { name: 'oxChange', label: 'Oxidation Number Increase (per atom)', type: 'number', unit: 'e⁻', min: 1, max: 8, step: '1' },
    { name: 'redChange', label: 'Oxidation Number Decrease (per atom)', type: 'number', unit: 'e⁻', min: 1, max: 8, step: '1' },
  ],
  compute: (v) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
    const lcm = (v.oxChange * v.redChange) / (v.oxChange === v.redChange ? v.oxChange : gcd(v.oxChange, v.redChange))
    const oxCoeff = lcm / v.oxChange
    const redCoeff = lcm / v.redChange
    return {
      result: `Ox: ${oxCoeff}, Red: ${redCoeff}`, label: 'Balancing Coefficients', unit: '',
      steps: [
        { label: 'Oxidation: electron loss per atom', value: `${v.oxChange} e⁻` },
        { label: 'Reduction: electron gain per atom', value: `${v.redChange} e⁻` },
        { label: 'LCM of electron change', value: `${lcm}` },
        { label: 'Coefficient for oxidized species', value: `${oxCoeff}` },
        { label: 'Coefficient for reduced species', value: `${redCoeff}` },
      ]
}
  },
  description: 'Redox balancing uses the half-reaction method: electrons lost in oxidation must equal electrons gained in reduction. Coefficients are determined by the least common multiple of electron changes.',
  formula: 'LCM(ox_change, red_change) → ox_coeff = LCM / ox_change, red_coeff = LCM / red_change',
  interpretation: 'The coefficients ensure electron conservation. For Fe²⁺ → Fe³⁺ + e⁻ (ox) and MnO₄⁻ → Mn²⁺ + 5e⁻ (red), LCM = 5, so 5 Fe²⁺ are needed per MnO₄⁻.'
}

export default calcDef

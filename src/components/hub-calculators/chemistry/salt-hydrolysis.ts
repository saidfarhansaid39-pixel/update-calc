import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    saltConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kaOrKb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    type: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'saltConc', label: 'Salt Concentration', type: 'number', unit: 'M', min: 1e-10, max: 10, step: 'any' },
    { name: 'kaOrKb', label: 'Ka (cationic salt) or Kb (anionic salt)', type: 'number', unit: '', min: 1e-15, max: 1, step: 'any' },
    { name: 'type', label: 'Salt Type', type: 'select', options: [{ label: 'Cationic (acidic)', value: 'cationic' }, { label: 'Anionic (basic)', value: 'anionic' }] },
  ],
  compute: (v) => {
    const hOrOh = Math.sqrt(v.kaOrKb * v.saltConc)
    const pH = v.type === 'cationic' ? -Math.log10(hOrOh) : 14 + Math.log10(hOrOh)
    return {
      result: pH, label: 'pH of Salt Solution', unit: '',
      steps: [
        { label: 'Salt concentration', value: `${v.saltConc} M` },
        { label: 'Ka or Kb', value: `${v.kaOrKb.toExponential(3)}` },
        { label: v.type === 'cationic' ? '[H⁺] = √(Ka × C)' : '[OH⁻] = √(Kb × C)', value: `${hOrOh.toExponential(4)} M` },
        { label: 'pH', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Salt hydrolysis occurs when a salt dissolves in water and its ions react with water to produce H⁺ or OH⁻. Cationic salts (from weak bases) give acidic solutions, anionic salts (from weak acids) give basic solutions.',
  formula: 'For cationic salt (NH₄⁺): [H⁺] = √(Ka × C) | For anionic salt (CH₃COO⁻): [OH⁻] = √(Kb × C)',
  interpretation: 'NaCl (strong acid + strong base) gives pH 7 — no hydrolysis. NH₄Cl (weak base + strong acid) gives acidic pH. NaCH₃COO (weak acid + strong base) gives basic pH.'
}

export default calcDef

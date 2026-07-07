import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    dH: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number'),
    dS: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number'),
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'dH', label: 'Enthalpy Change ΔH', type: 'number', unit: 'kJ/mol', min: -5000, max: 5000, step: '0.1' },
    { name: 'dS', label: 'Entropy Change ΔS', type: 'number', unit: 'J/(mol·K)', min: -5000, max: 5000, step: '0.1' },
    { name: 'temp', label: 'Temperature', type: 'number', unit: 'K', min: 1, max: 10000, step: '1' },
  ],
  compute: (v) => {
    const dG = v.dH - (v.dS / 1000) * v.temp
    const spont = dG < 0 ? 'Spontaneous (exergonic)' : dG > 0 ? 'Non-spontaneous (endergonic)' : 'At equilibrium'
    return {
      result: dG, label: 'Gibbs Free Energy ΔG', unit: 'kJ/mol',
      steps: [
        { label: 'ΔH', value: `${v.dH >= 0 ? '+' : ''}${v.dH} kJ/mol` },
        { label: 'ΔS', value: `${v.dS >= 0 ? '+' : ''}${v.dS} J/(mol·K)` },
        { label: 'TΔS', value: `${(v.dS / 1000 * v.temp).toFixed(2)} kJ/mol` },
        { label: 'ΔG = ΔH - TΔS', value: `${dG >= 0 ? '+' : ''}${dG.toFixed(2)} kJ/mol` },
        { label: 'Spontaneity', value: spont },
      ]
}
  },
  description: 'Gibbs free energy (ΔG) determines reaction spontaneity. ΔG = ΔH - TΔS. Negative ΔG means spontaneous.',
  formula: 'ΔG = ΔH - TΔS',
  interpretation: 'ΔG < 0: spontaneous. ΔG > 0: non-spontaneous (needs work input). ΔG = 0: equilibrium. Endothermic reactions (ΔH > 0) can be spontaneous at high T if ΔS > 0.'
}

export default calcDef

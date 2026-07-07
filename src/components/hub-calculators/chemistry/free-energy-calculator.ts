import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    dH: z.string().min(1, 'Required').refine(v => parseFloat(v) >= -9999 && parseFloat(v) <= 9999, 'Valid range'),
    dS: z.string().min(1, 'Required').refine(v => parseFloat(v) >= -9999 && parseFloat(v) <= 9999, 'Valid range'),
    t: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'dH', label: 'Enthalpy Change ΔH', type: 'number', unit: 'kJ/mol', min: -5000, max: 5000, step: '0.1' },
    { name: 'dS', label: 'Entropy Change ΔS', type: 'number', unit: 'J/(mol·K)', min: -5000, max: 5000, step: '0.1' },
    { name: 't', label: 'Temperature', type: 'number', unit: 'K', min: 1, max: 10000, step: '1' },
  ],
  compute: (v) => {
    const dG = v.dH - (v.dS / 1000) * v.t
    const spont = dG < 0 ? 'Spontaneous' : dG > 0 ? 'Non-spontaneous' : 'At equilibrium'
    return {
      result: dG, label: 'Gibbs Free Energy ΔG', unit: 'kJ/mol',
      steps: [
        { label: 'ΔH', value: `${v.dH} kJ/mol` },
        { label: 'ΔS', value: `${v.dS} J/(mol·K)` },
        { label: 'T', value: `${v.t} K` },
        { label: 'ΔG = ΔH - TΔS', value: `${dG.toFixed(2)} kJ/mol` },
        { label: 'Spontaneity', value: spont },
      ]
}
  },
  description: 'Gibbs free energy (ΔG) determines whether a reaction is spontaneous under constant temperature and pressure conditions.',
  formula: 'ΔG = ΔH - TΔS',
  interpretation: 'ΔG < 0: spontaneous (exergonic). ΔG > 0: non-spontaneous (endergonic). ΔG = 0: at equilibrium. Even endothermic reactions (ΔH > 0) can be spontaneous if ΔS is large enough.'
}

export default calcDef

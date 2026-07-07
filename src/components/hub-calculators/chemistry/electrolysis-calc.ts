import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    current: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    n: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'current', label: 'Current (I)', type: 'number', unit: 'A', min: 0.001, step: '0.001' },
    { name: 'time', label: 'Time (t)', type: 'number', unit: 's', min: 0.1, step: '0.1' },
    { name: 'mw', label: 'Molar Mass of Substance', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
    { name: 'n', label: 'Electrons per Ion (n)', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const F = 96485
    const charge = v.current * v.time
    const moles = charge / (v.n * F)
    const mass = moles * v.mw
    return {
      result: mass, label: 'Mass Deposited', unit: 'g',
      steps: [
        { label: 'Charge Q = I × t', value: `${charge.toFixed(1)} C` },
        { label: 'Moles e⁻ = Q / F', value: `${(charge / F).toExponential(4)} mol e⁻` },
        { label: 'Moles substance = e⁻ / n', value: `${moles.toExponential(4)} mol` },
        { label: 'Mass = moles × MW', value: `${mass.toFixed(4)} g` },
      ]
}
  },
  description: 'Electrolysis uses electrical current to drive a non-spontaneous redox reaction. The mass deposited is given by m = (I × t × M)/(n × F) — Faraday\'s law of electrolysis.',
  formula: 'm = (I × t × M) / (n × F)',
  interpretation: 'F = 96485 C/mol e⁻. For copper deposition (Cu²⁺ + 2e⁻ → Cu), n = 2. A higher current or longer time deposits more metal. Electrolysis is used in electroplating, metal refining, and water splitting.'
}

export default calcDef

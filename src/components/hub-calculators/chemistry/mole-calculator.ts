import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mass', label: 'Mass of Substance', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'mw', label: 'Molar Mass / Weight', type: 'number', unit: 'g/mol', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const moles = v.mass / v.mw
    const particles = moles * 6.022e23
    return {
      result: moles, label: 'Number of Moles', unit: 'mol',
      steps: [
        { label: 'Mass', value: `${v.mass} g` },
        { label: 'Molar mass', value: `${v.mw} g/mol` },
        { label: 'Moles = mass / MW', value: `${moles.toFixed(6)} mol` },
        { label: 'Particles (× Avogadro)', value: `${particles.toExponential(3)}` },
      ]
}
  },
  description: 'The mole is the SI unit for amount of substance. One mole contains exactly 6.022 × 10²³ particles (Avogadro\'s number).',
  formula: 'n = m / M',
  interpretation: '1 mole = 6.022 × 10²³ particles. Moles bridge the macroscopic world (grams) and the microscopic world (atoms/molecules).'
}

export default calcDef

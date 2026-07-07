import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molesVal: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'molesVal', label: 'Number of Moles', type: 'number', unit: 'mol', min: 1e-10, step: 'any' },
  ],
  compute: (v) => {
    const na = 6.02214076e23
    const particles = v.molesVal * na
    return {
      result: particles, label: 'Number of Particles', unit: '',
      steps: [
        { label: 'Moles', value: `${v.molesVal} mol` },
        { label: 'Avogadro\'s number', value: `${na.toExponential(4)}` },
        { label: 'Particles = moles × N_A', value: particles.toExponential(6) },
      ]
}
  },
  description: 'Avogadro\'s number (6.022 × 10²³) relates the number of moles to the number of elementary entities (atoms, molecules, ions, or formula units).',
  formula: 'Number of particles = n × N_A',
  interpretation: 'One mole of any substance contains exactly 6.022 × 10²³ particles. This number was chosen so that the mass of one mole in grams equals the atomic/molecular mass in daltons.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    moles: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    n: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'moles', label: 'Moles of Substance', type: 'number', unit: 'mol', min: 0.0001, step: '0.0001' },
    { name: 'n', label: 'Electrons per Molecule (n)', type: 'number', unit: 'e⁻', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const F = 96485
    const charge = v.moles * v.n * F
    return {
      result: charge, label: 'Total Charge (Q)', unit: 'C',
      steps: [
        { label: 'Moles of substance', value: `${v.moles} mol` },
        { label: 'Electrons per formula unit', value: `${v.n} e⁻` },
        { label: 'Moles of e⁻ = n × moles', value: `${v.moles * v.n} mol e⁻` },
        { label: 'Q = n(e⁻) × F', value: `${charge.toFixed(1)} C` },
      ]
}
  },
  description: 'The Faraday constant (F = 96,485 C/mol) is the magnitude of electric charge per mole of electrons. It relates the amount of substance changed at an electrode to the quantity of electricity passed.',
  formula: 'Q = n × F × moles',
  interpretation: '1 Faraday = 96,485 C = charge of 1 mole of electrons. F = N_A × e (Avogadro\'s number × elementary charge). Used in all electrochemical calculations.'
}

export default calcDef

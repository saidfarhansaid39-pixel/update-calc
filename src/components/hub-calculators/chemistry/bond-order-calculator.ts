import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    bonding: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0'),
    antibonding: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0')
}),
  fields: [
    { name: 'bonding', label: 'Electrons in Bonding Orbitals', type: 'number', unit: 'e⁻', min: 0, max: 20, step: '1' },
    { name: 'antibonding', label: 'Electrons in Antibonding Orbitals', type: 'number', unit: 'e⁻', min: 0, max: 20, step: '1' },
  ],
  compute: (v) => {
    const bo = (v.bonding - v.antibonding) / 2
    const stable = bo > 0
    return {
      result: bo, label: 'Bond Order', unit: '',
      steps: [
        { label: 'Bonding e⁻', value: `${v.bonding}` },
        { label: 'Antibonding e⁻', value: `${v.antibonding}` },
        { label: 'Bond order = (B - A)/2', value: `${bo.toFixed(1)}` },
        { label: 'Bond type', value: bo === 1 ? 'Single' : bo === 2 ? 'Double' : bo === 3 ? 'Triple' : stable ? `Bond order ${bo.toFixed(1)}` : 'No bond (unstable)' },
      ]
}
  },
  description: 'Bond order indicates the number of chemical bonds between two atoms. It is calculated from molecular orbital theory as half the difference between bonding and antibonding electrons.',
  formula: 'Bond order = (bonding e⁻ - antibonding e⁻) / 2',
  interpretation: 'Bond order > 0: stable. Higher bond order means shorter, stronger bonds. Single bond (1.0), double (2.0), triple (3.0). Fractional bond orders occur in resonance structures.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 1 && n <= 7 }, '1-7'),
    l: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 0 && n <= 3 }, '0-3')
}),
  fields: [
    { name: 'n', label: 'Principal Quantum Number n', type: 'number', unit: '', min: 1, max: 7, step: '1' },
    { name: 'l', label: 'Azimuthal Quantum Number ℓ', type: 'number', unit: '', min: 0, max: 3, step: '1' },
  ],
  compute: (v) => {
    const lNames = ['s', 'p', 'd', 'f']
    const mlValues: string[] = []
    for (let ml = -v.l; ml <= v.l; ml++) mlValues.push(`${ml}`)
    return {
      result: v.l, label: 'Angular Momentum ℓ', unit: '',
      steps: [
        { label: 'n', value: `${v.n}` },
        { label: 'ℓ (0=s, 1=p, 2=d, 3=f)', value: `${v.l} (${lNames[v.l] || '?'})` },
        { label: 'mℓ values', value: mlValues.join(', ') },
        { label: 'Number of orbitals', value: `${2 * v.l + 1}` },
        { label: 'Max electrons', value: `${2 * (2 * v.l + 1)}` },
      ]
}
  },
  description: 'Quantum numbers describe the properties of atomic orbitals and the electrons within them: n (energy), ℓ (shape), mℓ (orientation), and ms (spin).',
  formula: 'ℓ = 0 to n-1, mℓ = -ℓ to +ℓ, ms = ±½',
  interpretation: 'ℓ = 0 (s orbital, spherical), ℓ = 1 (p orbital, dumbbell), ℓ = 2 (d orbital, clover), ℓ = 3 (f orbital, complex). Each orbital holds 2 electrons with opposite spins.'
}

export default calcDef

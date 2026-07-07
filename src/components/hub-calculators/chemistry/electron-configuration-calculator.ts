import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    atomicNumber: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 1 && n <= 118 }, '1-118')
}),
  fields: [
    { name: 'atomicNumber', label: 'Atomic Number (Z)', type: 'number', unit: '', min: 1, max: 118, step: '1' },
  ],
  compute: (v) => {
    const order = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p']
    const caps = [2, 2, 6, 2, 6, 2, 10, 6, 2, 10, 6, 2, 14, 10, 6, 2, 14, 10, 6]
    let remaining = v.atomicNumber
    const config: string[] = []
    for (let i = 0; i < order.length && remaining > 0; i++) {
      const fill = Math.min(remaining, caps[i])
      config.push(`${order[i]}${fill}`)
      remaining -= fill
    }
    const ngSym = v.atomicNumber <= 2 ? '' : v.atomicNumber <= 10 ? 'He' : v.atomicNumber <= 18 ? 'Ne' : v.atomicNumber <= 36 ? 'Ar' : v.atomicNumber <= 54 ? 'Kr' : v.atomicNumber <= 86 ? 'Xe' : 'Rn'
    const nobleGas = ngSym ? `[${ngSym}]` : ''
    const ngOrbital: Record<string, string> = { He: '1s', Ne: '2p', Ar: '3p', Kr: '4p', Xe: '5p', Rn: '6p' }
    const startIdx = ngSym ? config.findIndex(c => order.indexOf(c.slice(0, -1)) > order.indexOf(ngOrbital[ngSym])) : 0
    const abbrev = !ngSym ? config.join(' ') : `${nobleGas} ${config.slice(startIdx >= 0 ? startIdx : 0).join(' ')}`
    return {
      result: v.atomicNumber, label: 'Electron Configuration', unit: '',
      steps: [
        { label: 'Atomic number Z', value: `${v.atomicNumber}` },
        { label: 'Full configuration', value: config.join(' ') },
        { label: 'Noble gas shorthand', value: abbrev },
      ]
}
  },
  description: 'Electron configuration describes the arrangement of electrons in an atom\'s orbitals, following the Aufbau principle, Hund\'s rule, and the Pauli exclusion principle.',
  formula: 'Order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s → 4f → 5d → 6p → 7s → 5f → 6d → 7p',
  interpretation: 'The configuration shows how electrons fill orbitals. s orbitals hold 2, p hold 6, d hold 10, f hold 14 electrons. The valence electrons determine chemical properties.'
}

export default calcDef

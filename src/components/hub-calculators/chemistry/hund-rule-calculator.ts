import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    electrons: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 1 && n <= 18 }, '1-18'),
    orbitalType: z.string()
}),
  fields: [
    { name: 'electrons', label: 'Number of Electrons', type: 'number', unit: 'e⁻', min: 1, max: 18, step: '1' },
    { name: 'orbitalType', label: 'Orbital Type', type: 'select', options: [
      { label: 'p orbitals (max 6)', value: 'p' },
      { label: 'd orbitals (max 10)', value: 'd' },
      { label: 'f orbitals (max 14)', value: 'f' },
    ] },
  ],
  compute: (v) => {
    const maxPer = { p: 6, d: 10, f: 14 }
    const orbs = { p: 3, d: 5, f: 7 }
    const max = maxPer[v.orbitalType as keyof typeof maxPer] || 6
    const nOrbs = orbs[v.orbitalType as keyof typeof orbs] || 3
    const e = Math.min(v.electrons, max)
    let paired = e > nOrbs ? e - nOrbs : 0
    const unpaired = e > nOrbs ? nOrbs : e
    const config: string[] = []
    for (let i = 0; i < nOrbs; i++) {
      if (i < unpaired) config.push('↑')
      else if (paired > 0 && i < unpaired + paired) { config.push('↑↓'); paired -= 2 }
      else config.push('_')
    }
    return {
      result: unpaired, label: 'Unpaired Electrons', unit: '',
      steps: [
        { label: 'Electrons in subshell', value: `${e}` },
        { label: 'Total orbitals', value: `${nOrbs}` },
        { label: 'Unpaired electrons', value: `${unpaired}` },
        { label: 'Arrangement', value: config.join(' ') },
        { label: 'Hund\'s rule', value: 'Electrons fill orbitals singly before pairing' },
      ]
}
  },
  description: 'Hund\'s Rule states that electrons fill degenerate orbitals singly before pairing up, maximizing total spin. This results in the most stable ground state configuration.',
  formula: 'Each orbital gets one electron before any gets two',
  interpretation: 'For carbon (2p²), both electrons are unpaired in separate p orbitals. This maximizes exchange energy and explains why O₂ is paramagnetic.'
}

export default calcDef

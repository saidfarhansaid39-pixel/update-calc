import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sCount: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1 && parseInt(v) <= 6, '1-6'),
    dCount: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 2, '0-2')
}),
  fields: [
    { name: 'sCount', label: 'Sigma Bonds + Lone Pairs (steric #)', type: 'number', unit: '', min: 1, max: 6, step: '1' },
    { name: 'dCount', label: 'd Orbitals Involved', type: 'number', unit: '', min: 0, max: 2, step: '1' },
  ],
  compute: (v) => {
    const hybMap: Record<string, string> = {
      '2,0': 'sp', '3,0': 'sp²', '4,0': 'sp³', '5,0': 'sp³d', '6,0': 'sp³d²',
      '5,1': 'sp³d', '6,1': 'sp³d²', '6,2': 'd²sp³'
}
    const key = `${v.sCount},${v.dCount}`
    const hyb = hybMap[key] || (v.sCount === 2 ? 'sp' : v.sCount === 3 ? 'sp²' : v.sCount === 4 ? 'sp³' : v.sCount === 5 ? 'sp³d' : v.sCount === 6 ? 'sp³d²' : 'Unknown')
    const angleMap: Record<string, string> = { 'sp': '180°', 'sp²': '120°', 'sp³': '109.5°', 'sp³d': '90°, 120°', 'sp³d²': '90°' }
    return {
      result: hyb, label: 'Hybridization', unit: '',
      steps: [
        { label: 'Steric number', value: `${v.sCount}` },
        { label: 'Hybridization', value: hyb },
        { label: 'Bond angles', value: angleMap[hyb] || 'Varies' },
        { label: 'Geometry', value: v.sCount === 2 ? 'Linear' : v.sCount === 3 ? 'Trigonal planar' : v.sCount === 4 ? 'Tetrahedral' : v.sCount === 5 ? 'Trigonal bipyramidal' : v.sCount === 6 ? 'Octahedral' : '—' },
      ]
}
  },
  description: 'Hybridization describes the mixing of atomic orbitals to form new hybrid orbitals that explain molecular geometry and bonding patterns.',
  formula: 'Steric number = σ bonds + lone pairs. Hybridization: 2=sp, 3=sp², 4=sp³, 5=sp³d, 6=sp³d²',
  interpretation: 'sp: linear (180°), sp²: trigonal planar (120°), sp³: tetrahedral (109.5°), sp³d: trigonal bipyramidal, sp³d²: octahedral (90°).'
}

export default calcDef

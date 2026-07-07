import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    geometry: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'geometry', label: 'Molecular Geometry', type: 'select', options: [
      { label: 'Linear', value: 'linear' },
      { label: 'Trigonal planar', value: 'trigonal_planar' },
      { label: 'Tetrahedral', value: 'tetrahedral' },
      { label: 'Square planar', value: 'square_planar' },
      { label: 'Trigonal bipyramidal', value: 'trigonal_bipyramidal' },
      { label: 'Octahedral', value: 'octahedral' },
    ] },
  ],
  compute: (v) => {
    const data: Record<string, { cn: number; geometry: string; examples: string }> = {
      'linear': { cn: 2, geometry: 'Linear', examples: 'Ag(NH₃)₂⁺, CO₂' },
      'trigonal_planar': { cn: 3, geometry: 'Trigonal planar', examples: 'BF₃, AlCl₃' },
      'tetrahedral': { cn: 4, geometry: 'Tetrahedral', examples: 'CH₄, Ni(CO)₄, Zn(NH₃)₄²⁺' },
      'square_planar': { cn: 4, geometry: 'Square planar', examples: 'Pt(NH₃)₂Cl₂, Ni(CN)₄²⁻' },
      'trigonal_bipyramidal': { cn: 5, geometry: 'Trigonal bipyramidal', examples: 'Fe(CO)₅, PCl₅' },
      'octahedral': { cn: 6, geometry: 'Octahedral', examples: 'Co(NH₃)₆³⁺, SF₆, Fe(CN)₆³⁻' }
}
    const d = data[v.geometry]
    return {
      result: d.cn, label: 'Coordination Number', unit: '',
      steps: [
        { label: 'Selected geometry', value: d.geometry },
        { label: 'Coordination number', value: `${d.cn}` },
        { label: 'Examples', value: d.examples },
      ]
}
  },
  description: 'Coordination number is the number of ligands directly bonded to a central metal ion in a coordination complex. It determines the geometry of the complex.',
  formula: 'CN = number of coordinate covalent bonds from ligands to metal center',
  interpretation: 'Common CN: 2 (linear, Ag⁺), 4 (tetrahedral/square planar, Zn²⁺/Pt²⁺), 6 (octahedral, Co³⁺/Fe³⁺). Larger metals can have CN = 7-12. CN affects color, magnetism, and reactivity.'
}

export default calcDef

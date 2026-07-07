import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mass2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    amu1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    amu2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mass1', label: 'Mass of Element 1', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'amu1', label: 'Atomic Mass of Element 1', type: 'number', unit: 'g/mol', min: 1, step: '0.01' },
    { name: 'mass2', label: 'Mass of Element 2', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'amu2', label: 'Atomic Mass of Element 2', type: 'number', unit: 'g/mol', min: 1, step: '0.01' },
  ],
  compute: (v) => {
    const mol1 = v.mass1 / v.amu1
    const mol2 = v.mass2 / v.amu2
    const ratio = mol1 / Math.min(mol1, mol2)
    const ratio2 = mol2 / Math.min(mol1, mol2)
    return {
      result: `${ratio.toFixed(1)} : ${ratio2.toFixed(1)}`, label: 'Empirical Formula Ratio', unit: '',
      steps: [
        { label: 'Moles of element 1', value: `${mol1.toFixed(4)} mol` },
        { label: 'Moles of element 2', value: `${mol2.toFixed(4)} mol` },
        { label: 'Divide by smallest', value: `${ratio.toFixed(2)} : ${ratio2.toFixed(2)}` },
      ]
}
  },
  description: 'The empirical formula is the simplest whole-number ratio of atoms in a compound, determined from the mass or percent composition of each element.',
  formula: 'moles = mass / atomic mass → divide by smallest number',
  interpretation: 'For glucose (C₆H₁₂O₆), the empirical formula is CH₂O. The empirical formula may differ from the molecular formula. Round to nearest whole number when possible.'
}

export default calcDef

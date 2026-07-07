import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    cStock: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vStock: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vDil: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    steps: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'cStock', label: 'Stock Concentration', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'vStock', label: 'Stock Volume', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'vDil', label: 'Diluent Volume', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'steps', label: 'Number of Serial Steps', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const df = (v.vStock + v.vDil) / v.vStock
    let c = v.cStock
    const concs: string[] = []
    for (let i = 1; i <= v.steps; i++) {
      c = c / df
      concs.push(`Step ${i}: ${c.toFixed(6)} M`)
    }
    return {
      result: c, label: 'Final Concentration', unit: 'M',
      steps: [
        { label: 'Stock', value: `${v.cStock} M` },
        { label: 'Dilution factor/step', value: `${df.toFixed(2)}×` },
        ...concs.map((s, i) => ({ label: `Step ${i + 1}`, value: s.split(': ')[1] })),
      ]
}
  },
  description: 'Serial dilution involves repeatedly diluting a solution to create a geometric series of concentrations, commonly used in microbiology and biochemistry.',
  formula: 'Cₙ = C₀ / DFⁿ where DF = (Vₛₜₒcₖ + V_dil) / Vₛₜₒcₖ',
  interpretation: 'Each step dilutes by the same factor. For a 1:2 serial dilution, each step halves the concentration. The number of steps determines the concentration range.'
}

export default calcDef

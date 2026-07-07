import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    colonies: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    dnaAmount: z.string().refine(v => parseFloat(v) > 0, '>0'),
    dilutionFactor: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'colonies', label: 'Colonies Counted', type: 'number', min: 0, step: '1' },
    { name: 'dnaAmount', label: 'DNA Amount (µg)', type: 'number', min: 0.001, step: '0.01' },
    { name: 'dilutionFactor', label: 'Dilution Factor (fold)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const eff = v.dnaAmount > 0 ? (v.colonies * v.dilutionFactor) / v.dnaAmount : 0
    return {
      result: eff, label: 'Transformation Efficiency', unit: 'CFU/µg',
      steps: [
        { label: 'Colonies counted', value: `${v.colonies}` },
        { label: 'DNA used', value: `${v.dnaAmount} µg` },
        { label: 'Dilution factor', value: `${v.dilutionFactor}` },
        { label: 'Efficiency = (colonies × dilution) / DNA', value: `${eff.toExponential(4)} CFU/µg` },
        { label: 'Rating', value: eff > 1e9 ? 'Very high' : eff > 1e8 ? 'High' : eff > 1e7 ? 'Standard' : eff > 1e6 ? 'Low' : 'Poor' },
      ]
}
  },
  description: 'Transformation efficiency measures how many competent cells take up and express plasmid DNA. It is expressed as colony-forming units per microgram of DNA.',
  formula: 'Efficiency (CFU/µg) = (colonies × dilution factor) / µg DNA plated',
  interpretation: 'Routine competent cells: 106-107 CFU/µg. High efficiency: 108-10?. Chemically competent E. coli: 106-108. Electrocompetent: 10?-10¹°. Lower efficiency may indicate poor competence or toxic DNA.'
}

export default calcDef

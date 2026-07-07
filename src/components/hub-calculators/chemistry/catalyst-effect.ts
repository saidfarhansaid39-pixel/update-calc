import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    eaUncatalyzed: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    eaCatalyzed: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'eaUncatalyzed', label: 'Ea (uncatalyzed)', type: 'number', unit: 'kJ/mol', min: 1, step: '1' },
    { name: 'eaCatalyzed', label: 'Ea (catalyzed)', type: 'number', unit: 'kJ/mol', min: 1, step: '1' },
    { name: 'temp', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 0.008314
    const eaDiff = v.eaUncatalyzed - v.eaCatalyzed
    const rateRatio = Math.exp(eaDiff / (R * v.temp))
    return {
      result: rateRatio, label: 'Rate Enhancement Factor (k_cat/k_uncat)', unit: '×',
      steps: [
        { label: 'Ea (uncatalyzed)', value: `${v.eaUncatalyzed} kJ/mol` },
        { label: 'Ea (catalyzed)', value: `${v.eaCatalyzed} kJ/mol` },
        { label: 'ΔEa (lowering)', value: `${eaDiff.toFixed(1)} kJ/mol` },
        { label: 'Rate ratio = exp(ΔEa/RT)', value: `${rateRatio.toExponential(4)}×` },
      ]
}
  },
  description: 'A catalyst provides an alternative reaction pathway with lower activation energy (Ea). Even a small reduction in Ea dramatically increases the reaction rate.',
  formula: 'k_cat / k_uncat = exp((Ea_uncat - Ea_cat) / RT)',
  interpretation: 'A catalyst lowers Ea by 10-80 kJ/mol, potentially increasing rate by 10²-10¹⁴×. Catalysts are not consumed — they participate in the reaction but are regenerated. Enzymes are biological catalysts.'
}

export default calcDef

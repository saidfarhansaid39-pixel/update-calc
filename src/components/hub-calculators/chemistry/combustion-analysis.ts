import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    massCO2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    massH2O: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    massSample: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'massSample', label: 'Mass of Sample', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'massCO2', label: 'Mass of CO₂ Produced', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'massH2O', label: 'Mass of H₂O Produced', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const cMass = v.massCO2 * 12.011 / 44.01
    const hMass = v.massH2O * 2.016 / 18.015
    const oMass = v.massSample - cMass - hMass
    const cPct = cMass / v.massSample * 100
    const hPct = hMass / v.massSample * 100
    const oPct = oMass / v.massSample * 100
    return {
      result: `${cPct.toFixed(2)}% C`, label: 'Composition', unit: '',
      steps: [
        { label: 'Mass of carbon', value: `${cMass.toFixed(4)} g` },
        { label: 'Mass of hydrogen', value: `${hMass.toFixed(4)} g` },
        { label: 'Mass of oxygen (by diff)', value: `${oMass.toFixed(4)} g` },
        { label: '% C', value: `${cPct.toFixed(2)}%` },
        { label: '% H', value: `${hPct.toFixed(2)}%` },
        { label: '% O', value: `${oPct.toFixed(2)}%` },
      ]
}
  },
  description: 'Combustion analysis burns a sample to produce CO₂ and H₂O, from which the masses of carbon, hydrogen, and oxygen in the original sample are calculated.',
  formula: 'C mass = CO₂ mass × (12.011 / 44.01), H mass = H₂O mass × (2.016 / 18.015)',
  interpretation: 'The difference between sample mass and (C + H mass) is assumed to be oxygen. This data is used to determine empirical formulas of organic compounds.'
}

export default calcDef

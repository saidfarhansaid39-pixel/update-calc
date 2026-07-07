import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    tissueMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    lysisVol: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    measuredConc: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0')
}),
  fields: [
    { name: 'tissueMass', label: 'Tissue Mass (or cell pellet)', type: 'number', unit: 'mg', min: 0.1, step: '1' },
    { name: 'lysisVol', label: 'Lysis Buffer Volume', type: 'number', unit: 'µL', min: 10, step: '10' },
    { name: 'measuredConc', label: 'Measured Protein Concentration', type: 'number', unit: 'µg/µL', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const totalProtein = v.measuredConc * v.lysisVol
    const yieldPerMg = v.tissueMass > 0 ? totalProtein / v.tissueMass : 0
    const loadingVol10 = v.measuredConc > 0 ? 10 / v.measuredConc : 0
    return {
      result: totalProtein, label: 'Total Protein Yield', unit: 'µg',
      steps: [
        { label: 'Tissue/cells', value: `${v.tissueMass} mg` },
        { label: 'Lysis buffer volume', value: `${v.lysisVol} µL` },
        { label: 'Measured concentration', value: `${v.measuredConc.toFixed(2)} µg/µL` },
        { label: 'Total yield = conc × volume', value: `${totalProtein.toFixed(0)} µg` },
        { label: 'Yield per mg tissue', value: yieldPerMg > 0 ? `${yieldPerMg.toFixed(1)} µg/mg` : 'N/A' },
        { label: 'Volume for 10 µg loading', value: loadingVol10 > 0 ? `${loadingVol10.toFixed(1)} µL` : 'N/A' },
        { label: 'Typical yields', value: 'Tissue: 20-100 µg/mg | Cells: 100-300 µg per 106 cells | RIPA buffer extracts total protein' },
      ]
}
  },
  description: 'Protein extraction yield calculation from tissue or cells. Extraction efficiency depends on lysis buffer composition, tissue type, and homogenization method. RIPA buffer is the most common for total protein extraction.',
  formula: 'Total protein (µg) = Concentration (µg/µL) × Volume (µL) | Loading volume for X µg = X / Concentration | RIPA buffer: 50 mM Tris pH 8, 150 mM NaCl, 1% NP-40, 0.5% deoxycholate, 0.1% SDS',
  interpretation: 'Good extraction: > 50 µg/mg for soft tissues, > 10 µg/mg for fibrous tissues. Always add protease/phosphatase inhibitors fresh. BCA assay is more detergent-compatible than Bradford. Aliquot and freeze at -80°C — avoid freeze-thaw cycles.'
}

export default calcDef

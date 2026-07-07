import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sampleMass3: z.string().refine(v => parseFloat(v) > 0, '>0'),
    elutionVol2: z.string().refine(v => parseFloat(v) > 0, '>0'),
    concRna: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'sampleMass3', label: 'Sample Mass (mg)', type: 'number', min: 0.1, step: '1' },
    { name: 'elutionVol2', label: 'Elution Volume (µL)', type: 'number', min: 10, step: '10' },
    { name: 'concRna', label: 'RNA Concentration (ng/µL)', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const totalRna = v.concRna * v.elutionVol2 / 1000
    const rnaPerMg = v.sampleMass3 > 0 ? totalRna / v.sampleMass3 : 0
    return {
      result: totalRna, label: 'Total RNA Yield', unit: 'µg',
      steps: [
        { label: 'Sample mass', value: `${v.sampleMass3} mg` },
        { label: 'Elution volume', value: `${v.elutionVol2} µL` },
        { label: 'Concentration', value: `${v.concRna} ng/µL` },
        { label: 'Total yield', value: `${totalRna.toFixed(2)} µg` },
        { label: 'Yield per mg', value: `${rnaPerMg.toFixed(2)} µg/mg` },
        { label: 'A260/A280 (target > 2.0)', value: 'Check your spectrophotometer reading for purity' },
      ]
}
  },
  description: 'Calculate RNA extraction yield from tissue or cell samples. RNA is more labile than DNA, so careful handling and RNAse-free conditions are essential.',
  formula: 'Total yield (µg) = conc (ng/µL) × volume (µL) / 1000 | A260/A280 > 2.0 indicates pure RNA',
  interpretation: 'Expected yields: mammalian tissue 5-50 µg/100 mg, cells 5-20 µg/106 cells. A260/A280 < 1.9: protein or phenol contamination. RNA integrity should be verified by gel electrophoresis or Bioanalyzer.'
}

export default calcDef

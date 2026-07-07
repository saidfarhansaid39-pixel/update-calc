import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sampleMass2: z.string().refine(v => parseFloat(v) > 0, '>0'),
    elutionVol: z.string().refine(v => parseFloat(v) > 0, '>0'),
    concentrationDna: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'sampleMass2', label: 'Sample Mass/Tissue (mg)', type: 'number', min: 0.1, step: '1' },
    { name: 'elutionVol', label: 'Elution Volume (µL)', type: 'number', min: 10, step: '10' },
    { name: 'concentrationDna', label: 'DNA Concentration (ng/µL)', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const totalYield = v.concentrationDna * v.elutionVol / 1000
    const yieldPerMg = v.sampleMass2 > 0 ? totalYield / v.sampleMass2 : 0
    return {
      result: totalYield, label: 'Total DNA Yield', unit: 'µg',
      steps: [
        { label: 'Sample mass', value: `${v.sampleMass2} mg` },
        { label: 'Elution volume', value: `${v.elutionVol} µL` },
        { label: 'Concentration', value: `${v.concentrationDna} ng/µL` },
        { label: 'Total yield = conc × volume / 1000', value: `${totalYield.toFixed(2)} µg` },
        { label: 'Yield per mg tissue', value: `${yieldPerMg.toFixed(2)} µg/mg` },
      ]
}
  },
  description: 'Calculate DNA extraction yield from tissue samples. Expected yields vary by tissue type and extraction method.',
  formula: 'Total yield (µg) = concentration (ng/µL) × elution volume (µL) / 1000 | Specific yield = total yield / sample mass',
  interpretation: 'Expected yields: mammalian tissue 10-100 µg/100 mg, cells 5-10 µg/106 cells, blood 20-50 µg/mL. Low yield may indicate degradation, poor lysis, or loss during purification.'
}

export default calcDef

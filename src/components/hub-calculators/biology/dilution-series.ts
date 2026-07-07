import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    stockConc2: z.string().refine(v => parseFloat(v) > 0, '>0'),
    desiredConc: z.string().refine(v => parseFloat(v) > 0, '>0'),
    desiredVol: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'stockConc2', label: 'Stock Concentration', type: 'number', min: 0.1, step: '0.1' },
    { name: 'desiredConc', label: 'Desired Final Concentration', type: 'number', min: 0.1, step: '0.1' },
    { name: 'desiredVol', label: 'Desired Final Volume', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const volStock = v.desiredConc * v.desiredVol / v.stockConc2
    const volDiluent = v.desiredVol - volStock
    const dilutionFactor = v.desiredVol > 0 ? v.stockConc2 / v.desiredConc : 0
    return {
      result: volStock, label: 'Volume of Stock Needed', unit: 'mL',
      steps: [
        { label: 'C1 (stock)', value: `${v.stockConc2}` },
        { label: 'C2 (desired)', value: `${v.desiredConc}` },
        { label: 'V2 (desired)', value: `${v.desiredVol} mL` },
        { label: 'V1 = C2 × V2 / C1', value: `${volStock.toFixed(3)} mL` },
        { label: 'Volume diluent to add', value: `${volDiluent.toFixed(3)} mL` },
        { label: 'Dilution factor (fold)', value: `${dilutionFactor.toFixed(1)}×` },
      ]
}
  },
  description: 'Calculate the volume of stock solution needed to prepare a desired concentration and volume. Based on the standard C1V1 = C2V2 formula for solution preparation.',
  formula: 'C1V1 = C2V2 | V1 = C2 × V2 / C1 | Diluent volume = V2 - V1',
  interpretation: 'For serial dilutions, use the dilution factor to create sequential dilutions. Always mix thoroughly between dilution steps. For accurate work, consider viscosity and density corrections.'
}

export default calcDef

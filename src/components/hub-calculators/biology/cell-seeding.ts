import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    desiredDensity: z.string().refine(v => parseFloat(v) > 0, '>0'),
    surfaceArea2: z.string().refine(v => parseFloat(v) > 0, '>0'),
    viability: z.string().refine(v => { const n = parseFloat(v); return n > 0 && n <= 100 }, '0-100'),
    stockConc: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'desiredDensity', label: 'Desired Seeding Density', type: 'number', unit: 'cells/cm²', min: 100, step: '100' },
    { name: 'surfaceArea2', label: 'Surface Area (cm²)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'viability', label: 'Cell Viability', type: 'number', unit: '%', min: 1, max: 100, step: '1' },
    { name: 'stockConc', label: 'Stock Concentration', type: 'number', unit: 'cells/mL', min: 100, step: '1000' },
  ],
  compute: (v) => {
    const viableFactor = v.viability / 100
    const cellsNeeded = v.desiredDensity * v.surfaceArea2
    const viableCellsNeeded = cellsNeeded / viableFactor
    const volumeNeeded = v.stockConc > 0 ? viableCellsNeeded / v.stockConc : 0
    return {
      result: cellsNeeded, label: 'Total Cells Needed', unit: 'cells',
      steps: [
        { label: 'Desired density', value: `${v.desiredDensity} cells/cm²` },
        { label: 'Surface area', value: `${v.surfaceArea2} cm²` },
        { label: 'Cells needed (100% viability)', value: `${Math.round(cellsNeeded)}` },
        { label: 'Viability correction', value: `${v.viability}% viable` },
        { label: 'Volume of stock to add', value: `${volumeNeeded.toFixed(2)} mL` },
      ]
}
  },
  description: 'Cell seeding calculations ensure consistent cell density across experiments. Proper seeding density is critical for reproducible cell culture experiments.',
  formula: 'Cells needed = desired density × surface area | Volume = cells / (stock concentration × viability factor)',
  interpretation: 'Typical seeding densities: 5,000-20,000 cells/cm² for adherent cells. Lower for slow-growing cells, higher for fast-growing. Correct for viability to maintain consistent viable cell density.'
}

export default calcDef

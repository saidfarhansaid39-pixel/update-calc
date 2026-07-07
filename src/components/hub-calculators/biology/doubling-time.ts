import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n0: z.string().refine(v => parseFloat(v) > 0, '>0'),
    nt: z.string().refine(v => parseFloat(v) > 0, '>0'),
    hoursElapsed: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'n0', label: 'Initial Cell Count (N0)', type: 'number', min: 1, step: '1' },
    { name: 'nt', label: 'Final Cell Count (Nt)', type: 'number', min: 1, step: '1' },
    { name: 'hoursElapsed', label: 'Time Elapsed (hours)', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const growthRate = Math.log(v.nt / v.n0) / v.hoursElapsed
    const dt = growthRate > 0 ? Math.LN2 / growthRate : Infinity
    const numDivisions = growthRate > 0 ? Math.log(v.nt / v.n0) / Math.LN2 : 0
    return {
      result: dt, label: 'Population Doubling Time', unit: 'hours',
      steps: [
        { label: 'N0 (initial)', value: `${v.n0}` },
        { label: 'Nt (final)', value: `${v.nt}` },
        { label: 'Time elapsed', value: `${v.hoursElapsed} h` },
        { label: 'Growth rate = ln(Nt/N0) / t', value: `${growthRate.toExponential(4)} h?¹` },
        { label: 'Doubling time = ln(2) / r', value: dt === Infinity ? 'No growth' : `${dt.toFixed(1)} h` },
        { label: 'Number of divisions', value: `${numDivisions.toFixed(1)}` },
      ]
}
  },
  description: 'Population doubling time is the time required for a cell population to double in number during exponential growth. It is a key measure of cell proliferation.',
  formula: 'Doubling time = ln(2) / r, where r = ln(Nt/N0) / t | Number of doublings = log2(Nt/N0)',
  interpretation: 'Mammalian cell lines: 18-36 h (HeLa ~24 h, CHO ~18 h). Bacteria: 20 min - 2 h. Yeast: 90-120 min. Faster doubling indicates more rapid proliferation. Compare under same conditions.'
}

export default calcDef

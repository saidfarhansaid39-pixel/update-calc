import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    tr: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t0: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'tr', label: 'Retention Time of Compound (tR)', type: 'number', unit: 'min', min: 0.1, step: '0.1' },
    { name: 't0', label: 'Dead Time / Void Time (t0)', type: 'number', unit: 'min', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const kp = (v.tr - v.t0) / v.t0
    return {
      result: kp, label: "Retention Factor (k')", unit: '',
      steps: [
        { label: 'tR (retention time)', value: `${v.tr} min` },
        { label: 't0 (void time)', value: `${v.t0} min` },
        { label: "k' = (tR - t0) / t0", value: `${kp.toFixed(3)}` },
        { label: 'Column selectivity α', value: 'Requires second compound for α = k₂\' / k₁\'' },
      ]
}
  },
  description: "The retention factor (k', also called capacity factor) in HPLC describes how long a compound is retained on the column relative to an unretained compound. It is independent of column dimensions and flow rate.",
  formula: "k' = (tR - t0) / t0",
  interpretation: "Optimal k' values are between 1 and 10 for good separation. k' < 1 means the compound elutes too quickly (poor retention), while k' > 20 means excessively long run times. The separation factor α = k₂' / k₁' should be > 1 for resolution."
}

export default calcDef

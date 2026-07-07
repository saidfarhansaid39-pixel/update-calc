import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pDist: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n < 1 }, '0-1 excl')
}),
  fields: [
    { name: 'pDist', label: 'Proportion of Differences (p)', type: 'number', min: 0, max: 0.99, step: '0.01' },
  ],
  compute: (v) => {
    const p = v.pDist
    const jcDist = -0.75 * Math.log(1 - (4/3) * p)
    return {
      result: jcDist, label: 'Jukes-Cantor Distance', unit: 'substitutions/site',
      steps: [
        { label: 'p-distance (observed)', value: `${p.toFixed(4)}` },
        { label: 'Jukes-Cantor correction', value: `${jcDist.toFixed(4)}` },
        { label: 'Multiple hits correction', value: `${(jcDist - p).toFixed(4)} extra subs/site` },
      ]
}
  },
  description: 'The Jukes-Cantor model corrects observed sequence differences for multiple substitutions at the same site. It provides a more accurate estimate of evolutionary distance than raw p-distance.',
  formula: 'dJC = -3/4 × ln(1 - 4p/3) | where p = proportion of observed differences',
  interpretation: 'JC distance > p-distance when p > 0 due to hidden multiple substitutions. The correction is modest for p < 0.1 but substantial for p > 0.3. Cannot be computed when p = 0.75.'
}

export default calcDef

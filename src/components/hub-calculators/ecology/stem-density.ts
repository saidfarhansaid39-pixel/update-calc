import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ stems: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'stems', label: 'Number of stems counted', type: 'number', min: 0, step: '1' },
    { name: 'area', label: 'Sampling area (ha)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => { const stems = parseInt(v.stems); const area = parseFloat(v.area); const density = stems / area; return { result: density, label: 'Stem Density', unit: 'stems/ha', steps: [{ label: 'Stems counted', value: `${stems}` }, { label: 'Area sampled', value: `${area} ha` }, { label: 'Density', value: `${density.toFixed(1)} stems/ha` }, { label: 'Interpretation', value: density>500?'High density':density>100?'Moderate':'Low density' }] } },
  description: 'Stem density is a fundamental forest structure metric counting the number of individual stems per unit area.',
  formula: 'Stem density = Stems counted / Area (ha)',
  interpretation: 'Tropical forests: 400-700 stems/ha. Temperate: 200-600 stems/ha. Boreal: 500-2000 stems/ha. Higher density = more competition.'
}

export default calcDef

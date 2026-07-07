import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bedLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedDepth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'bedLength', label: 'Bed Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedWidth', label: 'Bed Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedDepth', label: 'Soil Depth (in)', type: 'number', min: 6, step: '3' },
  ],
  compute: (v) => {
    const volumeCF = v.bedLength * v.bedWidth * (v.bedDepth / 12)
    const volumeCY = volumeCF / 27
    const bags = Math.ceil(volumeCF * 7.5 / 50)
    return { result: volumeCY, label: 'Soil Needed', unit: 'cu yd', steps: [{ label: 'Volume (cu ft)', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Cubic Yards', value: `${volumeCY.toFixed(2)} cu yd` }, { label: 'Bags (1.5 cu ft)', value: `${bags} bags` }] }
  },
  description: 'Calculate garden soil volume needed for raised beds and garden plots. Get cubic yards and bag estimates.',
  formula: 'Soil (cu yd) = (L × W × D/12) / 27',
  interpretation: 'Standard raised bed depth: 12 in for shallow roots, 18 in for deep roots. One cubic yard fills ~100 sq ft at 3 in depth. Mix: 40% topsoil, 40% compost, 20% aeration (perlite/pumice).'
}

export default calcDef

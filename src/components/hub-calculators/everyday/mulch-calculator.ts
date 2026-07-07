import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['ft', 'm']) }),
  fields: [
    { name: 'length', label: 'Length', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width', type: 'number', min: 1, step: '1' },
    { name: 'depth', label: 'Depth', type: 'number', min: 0.5, step: '0.5' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Feet (cu yd result)', value: 'ft' }, { label: 'Meters (cu m result)', value: 'm' }] },
  ],
  compute: (v) => { if (v.unit === 'ft') { const depthFt = v.depth / 12; const volumeCF = v.length * v.width * depthFt; const volumeCY = volumeCF / 27; const bags2cf = Math.ceil(volumeCY * 13.5); const bags3cf = Math.ceil(volumeCY * 9); return { result: volumeCY, label: 'Mulch Volume', unit: 'cu yd', steps: [{ label: 'Area', value: `${(v.length * v.width).toFixed(0)} sq ft` }, { label: 'Depth', value: `${v.depth} in = ${depthFt.toFixed(3)} ft` }, { label: 'Volume', value: `${volumeCF.toFixed(1)} cu ft = ${volumeCY.toFixed(2)} cu yd` }, { label: 'Bags (2 cu ft)', value: `${bags2cf} bags` }, { label: 'Bags (3 cu ft)', value: `${bags3cf} bags` }] } } else { const depthM = v.depth / 100; const volumeM3 = v.length * v.width * depthM; return { result: volumeM3, label: 'Mulch Volume', unit: 'cu m', steps: [{ label: 'Area', value: `${(v.length * v.width).toFixed(1)} sq m` }, { label: 'Depth', value: `${v.depth} cm = ${depthM.toFixed(3)} m` }, { label: 'Volume', value: `${volumeM3.toFixed(2)} cu m` }] } } },
  description: 'Calculate how much mulch you need for garden beds and landscaping based on area dimensions and desired depth.',
  formula: 'Volume = L × W × D | cu yd = cu ft / 27 | bags = cu yd × 13.5 (2cf bags)',
  interpretation: 'Standard depth: 2-4 in. One cubic yard covers ~100 sq ft at 3 in deep. Bulk mulch is cheaper than bagged. Dyed vs natural: dyed lasts longer but natural enriches soil as it decomposes.'
}

export default calcDef

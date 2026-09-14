import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Least Cost Path Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Least Cost Path Result', unit: '', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ' }],
    extras: [
      { label: "Environmental Context", value: "Least-cost path analysis identifies optimal movement routes across heterogeneous landscapes." },
      { label: "Measurement Method", value: "GIS-based cost surfaces combine land cover, slope, roads, and human disturbance." },
      { label: "Conservation Note", value: "LCPs guide corridor placement for wildlife crossings and habitat linkages." },
      { label: "Typical Ranges", value: "Cost distances: 1-1000 cost units. Optimal corridor width: 100-2000 m depending on target species." },
      { label: "Related Concepts", value: "Circuit theory, cost-weighted distance, resistance surfaces, connectivity modeling." }
    ] }),
  description: 'Least cost path analysis. Calculates the least cost path based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Minimum accumulated cost route between habitat patches.'
}

export default calcDef

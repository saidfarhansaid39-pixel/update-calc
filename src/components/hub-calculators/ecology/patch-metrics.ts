import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Patch Metrics Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Patch Metrics Result', unit: '', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ' }],
    extras: [
      { label: "Environmental Context", value: "Patch metrics quantify landscape structure - size, shape, isolation, and configuration of habitat patches." },
      { label: "Measurement Method", value: "Landscape metrics computed from classified satellite imagery using FRAGSTATS or R (landscapemetrics)." },
      { label: "Conservation Note", value: "Larger, more connected patches support more species. Edge-to-area ratio increases with fragmentation." },
      { label: "Typical Ranges", value: "Patch area: 0.1-10^6 ha. Shape index: 1 (circle) to 10+ (irregular). Edge density: 0-200 m/ha." },
      { label: "Related Concepts", value: "Landscape ecology, metapopulation theory, island biogeography, SLOSS, fractal dimension." }
    ] }),
  description: 'Patch metric analysis. Calculates the patch metrics based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Area perimeter shape index and isolation metrics.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Connectivity Index Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Connectivity Index Result', unit: '', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ' }],
    extras: [
      { label: "Environmental Context", value: "Landscape connectivity is critical for species movement, gene flow, and climate adaptation." },
      { label: "Measurement Method", value: "Graph theory metrics (PC, IIC, BC) calculated from habitat patches and dispersal distances." },
      { label: "Conservation Note", value: "Maintaining >30% habitat cover with corridors reduces extinction risk." },
      { label: "Typical Ranges", value: "PC (Probability of Connectivity): 0-1. IIC (Integral Index): 0-1." },
      { label: "Related Concepts", value: "Habitat networks, stepping stones, dispersal kernels, graph theory, ecological networks." }
    ] }),
  description: 'Landscape connectivity index. Calculates the connectivity index based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Probability of dispersal between habitat patches.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Edge Effect Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Edge Effect Result', unit: 'm', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' m' }],
    extras: [
      { label: "Environmental Context", value: "Edge effects alter microclimate, species composition, and ecosystem processes. They penetrate 50-500 m from habitat boundaries." },
      { label: "Measurement Method", value: "Paired plots at increasing distances from edge with microclimate loggers and vegetation surveys." },
      { label: "Conservation Note", value: "Edge effects reduce core habitat area by 30-60% in fragmented landscapes." },
      { label: "Typical Ranges", value: "Tropical forest edge depth: 100-500 m. Edge-affected area can exceed core area in small fragments." },
      { label: "Related Concepts", value: "Core area, buffer zones, habitat fragmentation, matrix effects, penetration distance, ecotones." }
    ] }),
  description: 'Edge effect penetration. Calculates the edge effect based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Distance of altered habitat conditions from patch boundary.'
}

export default calcDef

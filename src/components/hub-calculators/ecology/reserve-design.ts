import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Reserve Design Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Reserve Design Result', unit: 'ha', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ha' }],
    extras: [
      { label: "Environmental Context", value: "Reserve design principles aim to maximize biodiversity protection within limited conservation area." },
      { label: "Measurement Method", value: "MARXAN and Zonation software solve the minimum-set or maximum-coverage problem." },
      { label: "Conservation Note", value: "Well-designed reserves include large core areas, connectivity corridors, and buffer zones." },
      { label: "Typical Ranges", value: "Reserve size: 100-10^6 ha. Connectivity threshold: 30% habitat cover." },
      { label: "Related Concepts", value: "Systematic conservation planning, SLOSS, representativeness, irreplaceability." }
    ] }),
  description: 'Reserve design optimization. Calculates the reserve design based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Minimum area for target species persistence in reserve network.'
}

export default calcDef

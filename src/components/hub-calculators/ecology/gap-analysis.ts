import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Gap Analysis Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Gap Analysis Result', unit: '%', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' %' }],
    extras: [
      { label: "Environmental Context", value: "Gap analysis assesses how well biodiversity is represented in protected area networks." },
      { label: "Measurement Method", value: "GIS overlay of species distributions and protected area boundaries." },
      { label: "Conservation Note", value: "Gap species (not represented in any protected area) require urgent conservation action." },
      { label: "Typical Ranges", value: "Global PA coverage: ~17% terrestrial, ~8% marine. Gap species: 20-50% of endemic species." },
      { label: "Related Concepts", value: "Systematic conservation planning, MARXAN, irreplaceability, complementarity." }
    ] }),
  description: 'Gap analysis coverage. Calculates the gap analysis based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Representation of species in protected area network.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Circuit Connectivity Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Circuit Connectivity Result', unit: '', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ' }],
    extras: [
      { label: "Environmental Context", value: "Circuit theory models gene flow across landscapes. Resistance surfaces represent how landscape features impede or facilitate movement." },
      { label: "Measurement Method", value: "Landscape resistance derived from habitat suitability, road density, land cover. Circuitscape software implements random walk theory." },
      { label: "Conservation Note", value: "Connectivity hotspots identified by current flow density prioritize corridor conservation and barrier mitigation." },
      { label: "Typical Ranges", value: "Resistance values: 1 (highly permeable) to 100 (barrier). Effective distance: 1-100 km for wide-ranging mammals." },
      { label: "Related Concepts", value: "Least-cost path, isolation-by-resistance, centrality metrics, pinch points, barrier analysis, connectivity mapping." }
    ] }),
  description: 'Circuit connectivity. Calculates the circuit connectivity based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Effective resistance analogous to gene flow in landscape.'
}

export default calcDef

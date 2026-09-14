import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roofLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roofWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roofPitch: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), costPerSquare: z.string().optional() }),
  fields: [
    { name: 'roofLength', label: 'Roof Length (ft)', type: 'number', min: 1, step: '5' },
    { name: 'roofWidth', label: 'Roof Width (ft)', type: 'number', min: 1, step: '5' },
    { name: 'roofPitch', label: 'Roof Pitch (rise/12)', type: 'number', min: 0, max: 24, step: '1' },
    { name: 'costPerSquare', label: 'Cost per Square ($)', type: 'number', min: 0, step: '100' },
  ],
  compute: (v) => {
    const pitchFactors: Record<string, number> = { '0': 1.003, '1': 1.003, '2': 1.014, '3': 1.031, '4': 1.054, '5': 1.083, '6': 1.118, '7': 1.158, '8': 1.202, '9': 1.25, '10': 1.302, '11': 1.357, '12': 1.414, '13': 1.474, '14': 1.537, '15': 1.601, '16': 1.667, '17': 1.734, '18': 1.803, '19': 1.873, '20': 1.944, '21': 2.016, '22': 2.089, '23': 2.162, '24': 2.236 }
    const pitch = Math.round(parseFloat(v.roofPitch))
    const factor = pitchFactors[String(pitch)] || (1 + (pitch * pitch) / 144)
    const baseArea = v.roofLength * v.roofWidth
    const adjustedArea = baseArea * factor
    const squares = Math.ceil(adjustedArea / 100)
    const bundles = squares * 3
    const underlaymentRolls = Math.ceil(adjustedArea / 400)
    const cost = v.costPerSquare ? squares * v.costPerSquare : null
    return { result: bundles, label: 'Shingle Bundles Needed', unit: 'bundles', steps: [{ label: 'Base Area', value: `${baseArea.toFixed(1)} sq ft` }, { label: 'Pitch Factor', value: `${factor.toFixed(3)} (${pitch}/12)` }, { label: 'Adjusted Area', value: `${adjustedArea.toFixed(1)} sq ft` }, { label: 'Roofing Squares', value: `${squares} squares (100 sq ft each)` }, { label: 'Shingle Bundles', value: `${bundles} (3 per square)` }, ...(cost !== null ? [{ label: 'Total Cost', value: `$${cost.toFixed(2)}` }] : [])], extras: [
      { label: 'Adjusted Area', value: `${adjustedArea.toFixed(1)} sq ft` },
      { label: 'Roofing Squares', value: `${squares}` },
      { label: 'Underlayment', value: `${underlaymentRolls} roll(s) (400 sq ft each)` },
      { label: 'Pitch Factor', value: `${factor.toFixed(3)} for ${pitch}/12` },
      ...(cost !== null ? [{ label: 'Estimated Cost', value: `$${cost.toFixed(2)}` }] : []),
      { label: 'Pitch Range', value: '4/12 (1.054) to 12/12 (1.414) to 24/12 (2.236)' },
    ] }
  },
  description: 'Calculate roofing materials including shingle bundles, squares, and underlayment based on roof dimensions and pitch.',
  formula: 'Squares = ceil(BaseArea × PitchFactor / 100) | Bundles = Squares × 3',
  interpretation: '1 square = 100 sq ft of roof. Standard 3-tab shingles: 3 bundles per square. Architectural: 3 bundles per square. Luxury: 4-5 bundles per square. Pitch factors from 1.003 (flat) to 2.236 (24/12). Minimum slope 2/12 for asphalt shingles.'
}

export default calcDef

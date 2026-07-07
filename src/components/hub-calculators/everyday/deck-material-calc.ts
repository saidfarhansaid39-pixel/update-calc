import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ deckLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), deckWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), boardWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialType: z.string().min(1) }),
  fields: [
    { name: 'deckLength', label: 'Deck Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'deckWidth', label: 'Deck Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'boardWidth', label: 'Board Width (in)', type: 'number', min: 2, max: 12, step: '2' },
    { name: 'materialType', label: 'Material Type', type: 'select', options: [{ label: 'Pressure Treated Wood', value: 'pt' }, { label: 'Cedar/Redwood', value: 'cedar' }, { label: 'Composite', value: 'composite' }, { label: 'PVC', value: 'pvc' }] },
  ],
  compute: (v) => {
    const deckArea = v.deckLength * v.deckWidth
    const boardWidthFt = v.boardWidth / 12
    const gap = 0.125 / 12
    const boardsNeeded = Math.ceil(v.deckWidth / (boardWidthFt + gap))
    const linearFt = v.deckLength
    const materialCosts: Record<string, number> = { pt: 1.5, cedar: 3, composite: 5, pvc: 6 }
    const costPerBoardFt = materialCosts[v.materialType] || 1.5
    const totalBoardFt = linearFt * boardsNeeded
    const materialCost = totalBoardFt * costPerBoardFt
    return { result: materialCost, label: 'Deck Material Cost', unit: '$', steps: [{ label: 'Deck Area', value: `${deckArea} sq ft` }, { label: 'Boards Needed', value: `${boardsNeeded} boards` }, { label: 'Board Feet', value: `${totalBoardFt.toFixed(0)} board ft` }, { label: 'Material Cost', value: `$${materialCost.toFixed(2)}` }] }
  },
  description: 'Estimate deck material quantity and cost. Enter deck dimensions, board width, and material type to calculate board feet and total cost.',
  formula: 'Boards = Deck Width / (Board Width/12 + Gap) | Cost = Board Ft × Cost/Board Ft',
  interpretation: 'Add 10-15% waste for angle cuts. Pressure treated: $1-2/board ft, Cedar: $2.50-4, Composite: $4-7, PVC: $5-8. Hidden fasteners add $0.50-1/sq ft but give a cleaner look.'
}

export default calcDef

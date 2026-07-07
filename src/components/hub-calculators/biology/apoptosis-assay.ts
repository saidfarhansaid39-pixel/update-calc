import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    annexinPos: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '>=0'),
    totalCells: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'annexinPos', label: 'Annexin V Positive Cells', type: 'number', min: 0, step: '1' },
    { name: 'totalCells', label: 'Total Cells (gated)', type: 'number', min: 100, step: '100' },
  ],
  compute: (v) => {
    const pctApoptotic = (v.annexinPos / v.totalCells) * 100
    return {
      result: pctApoptotic, label: 'Apoptotic Cells', unit: '%',
      steps: [
        { label: 'Annexin V+ cells', value: `${v.annexinPos}` },
        { label: 'Total gated cells', value: `${v.totalCells}` },
        { label: '% apoptotic = AnnexinV+ / total × 100', value: `${pctApoptotic.toFixed(1)}%` },
        { label: 'Early vs late apoptosis', value: 'Add PI staining: Annexin V+/PI- = early, Annexin V+/PI+ = late/necrotic' },
        { label: 'Fold over background', value: `Compare to untreated control to determine apoptosis induction` },
      ]
}
  },
  description: 'Annexin V binding detects phosphatidylserine externalization, an early hallmark of apoptosis. Combined with propidium iodide (PI), it discriminates early apoptotic, late apoptotic, and necrotic cells.',
  formula: '% Apoptotic = (Annexin V+ cells / total cells) × 100% | Early apoptosis: Annexin V+/PI- | Late apoptosis/necrosis: Annexin V+/PI+',
  interpretation: 'Healthy cells: Annexin V-/PI-. Early apoptotic: Annexin V+/PI-. Late apoptotic: Annexin V+/PI+. Necrotic: Annexin V-/PI+. Background apoptosis (control) should be < 5% for healthy cultures.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ eyeHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), screenSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['in', 'cm']) }),
  fields: [
    { name: 'eyeHeight', label: 'Eye Height from Floor', type: 'number', min: 1, step: '1' },
    { name: 'screenSize', label: 'Monitor Diagonal Size', type: 'number', min: 1, step: '2' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }] },
  ],
  compute: (v) => { const screenH = v.screenSize * 0.49; const topOfScreen = v.eyeHeight + (screenH * 0.15); const bottomOfScreen = topOfScreen - screenH; const deskHeight = v.eyeHeight * 0.545; const standHeight = v.eyeHeight - deskHeight - (screenH * 0.5); const recommendedStand = Math.max(0, standHeight); return { result: recommendedStand, label: 'Recommended Stand/Mount Height', unit: v.unit, steps: [{ label: 'Eye Height', value: `${v.eyeHeight} ${v.unit}` }, { label: 'Top of Screen at/above Eye Level', value: 'Yes' }, { label: 'Monitor Height', value: `${screenH.toFixed(1)} ${v.unit}` }, { label: 'Stand Height Needed', value: `${recommendedStand.toFixed(1)} ${v.unit}` }] } },
  description: 'Calculate the optimal monitor height for ergonomic viewing based on your seated eye height and monitor size.',
  formula: 'Stand Height = Eye Height − Desk Height − (Screen Diagonal × 0.49 / 2)',
  interpretation: 'Ergonomic guidelines: top of screen at or slightly below eye level, 20-40 in viewing distance. Proper monitor height prevents neck strain, headaches, and upper back pain.'
}

export default calcDef
